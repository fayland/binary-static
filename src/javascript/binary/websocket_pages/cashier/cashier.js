const japanese_client = require('../../common_functions/country_base').japanese_client;
const Client   = require('../../base/client').Client;
const Header   = require('../../base/header').Header;
const url_for  = require('../../base/url').url_for;

const Cashier = (function() {
    'use strict';

    let withdrawal_locked;

    const lock_unlock_cashier = function(action, lock_type) {
        const toggle = action === 'lock' ? 'disable' : 'enable';
        if (/withdraw/.test(lock_type) && withdrawal_locked) {
            return;
        }
        $.each($('.' + lock_type), function() {
            replace_button(toggle, $(this).parent());
        });
    };

    const check_locked = function() {
        if (Client.get('is_virtual')) return;
        if (Client.status_detected('cashier_locked')) {
            lock_unlock_cashier('lock', 'deposit, .withdraw');
            withdrawal_locked = true;
        } else if (Client.status_detected('withdrawal_locked')) {
            lock_unlock_cashier('lock', 'withdraw');
            withdrawal_locked = true;
        } else if (Client.status_detected('unwelcome')) {
            lock_unlock_cashier('lock', 'deposit');
        } else if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({ get_account_status: '1', passthrough: { dispatch_to: 'Cashier' } });
        }
    };

    const check_top_up_withdraw = function() {
        if (is_cashier_page() && Client.get('values_set')) {
            const currency = Client.get('currency'),
                balance = Client.get('balance');
            if (Client.get('is_virtual')) {
                if ((currency !== 'JPY' && balance > 1000) ||
                    (currency === 'JPY' && balance > 100000)) {
                    replace_button('disable', '#VRT_topup_link');
                }
            } else if (!currency || +balance === 0) {
                lock_unlock_cashier('lock', 'withdraw');
            } else {
                lock_unlock_cashier('unlock', 'withdraw');
            }
        }
    };

    const replace_button = function(action, elementToReplace) {
        const $a = $(elementToReplace);
        if ($a.length === 0) return;
        const replace = ['button-disabled', 'pjaxload'];
        const disable = action === 'disable';
        const id = $a.attr('id');
        const href = $a.attr('href');
        const data_href = $a.attr('data-href');

        // use replaceWith, to disable previously caught pjax event
        const new_element = {
            class      : $a.attr('class').replace(replace[+disable], replace[+!disable]),
            id         : id,
            html       : $a.html(),
            href       : href || data_href,
            'data-href': href,
        };

        if (disable) {
            delete new_element.href;
        } else {
            delete new_element['data-href'];
        }
        if (!id) {
            delete new_element.id;
        }

        $a.replaceWith($('<a/>', new_element));
    };

    const onLoad = function() {
        if (is_cashier_page() && Client.is_logged_in()) {
            withdrawal_locked = false;
            Cashier.check_locked();
            Cashier.check_top_up_withdraw();
            Header.topbar_message_visibility(Client.landing_company());
        }
    };

    const is_cashier_page = function () {
        return /cashier[\/\w]*\.html/.test(window.location.pathname);
    };

    const onLoadPaymentMethods = function() {
        if (japanese_client()) {
            window.location.href = url_for('/');
        }
        if (Client.is_logged_in() && !Client.get('is_virtual')) {
            Cashier.check_locked();
        }
    };

    return {
        check_locked         : check_locked,
        check_top_up_withdraw: check_top_up_withdraw,
        onLoad               : onLoad,
        onLoadPaymentMethods : onLoadPaymentMethods,
    };
})();

module.exports = {
    Cashier: Cashier,
};

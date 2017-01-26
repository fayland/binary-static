const Defaults        = require('./defaults').Defaults;
const format_currency = require('../../common_functions/currency_to_symbol').format_currency;
const Client          = require('../../base/client').Client;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
function displayCurrencies() {
    'use strict';

    const target = document.getElementById('currency'),
        fragment =  document.createDocumentFragment(),
        currencies = Client.get('currencies').split(',');

    if (!target) {
        return;
    }

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (currencies.length > 1) {
        currencies.forEach(function (currency) {
            const option = document.createElement('option'),
                content = document.createTextNode(currency);

            option.setAttribute('value', currency);

            option.appendChild(content);
            fragment.appendChild(option);
        });

        target.appendChild(fragment);
        Defaults.set('currency', target.value);
    } else {
        $('#currency').replaceWith('<span id="' + target.getAttribute('id') +
                                    '" class="' + target.getAttribute('class') +
                                    '" value="' + currencies[0] + '">' +
                                    format_currency(currencies[0]) + '</span>');
        Defaults.set('currency', currencies[0]);
    }
}

module.exports = {
    displayCurrencies: displayCurrencies,
};

const generateBirthDate    = require('./attach_dom/birth_date_dropdown').generateBirthDate;
const objectNotEmpty       = require('../base/utility').objectNotEmpty;
const localize             = require('../base/localize').localize;
const Client               = require('../base/client').Client;
const url_for              = require('../base/url').url_for;
const Validate             = require('../common_functions/validation').Validate;
const Content              = require('../common_functions/content').Content;
const japanese_client      = require('../common_functions/country_base').japanese_client;
const appendTextValueChild = require('../common_functions/common_functions').appendTextValueChild;
const Cookies              = require('../../lib/js-cookie');
const moment               = require('moment');
const elementInnerHtml     = require('../common_functions/common_functions').elementInnerHtml;

const displayAcctSettings = function(response) {
    const country = response.get_settings.country_code;
    if (country && country !== null) {
        $('#real-form').show();
        Client.set('residence', country);
        generateBirthDate();
        generateState();
        if (/maltainvestws/.test(window.location.pathname)) {
            const settings = response.get_settings;
            const inputs = document.getElementsByClassName('input-disabled');
            let element;
            Object.keys(settings).forEach((key) => {
                element = document.getElementById(key);
                if (element) {
                    element.value = settings[key];
                }
            });
            if (settings.date_of_birth) {
                const date = moment.utc(settings.date_of_birth * 1000);
                document.getElementById('dobdd').value = date.format('DD').replace(/^0/, '');
                document.getElementById('dobmm').value = date.format('MM');
                document.getElementById('dobyy').value = date.format('YYYY');
                window.state = settings.address_state;
                toggleDisabled(inputs, true);
            } else {
                toggleDisabled(inputs, false);
            }
        }
    } else if (document.getElementById('move-residence-here') && $('#residence-form').is(':hidden')) {
        show_residence_form();
    }
};

const toggleDisabled = (inputs, status) => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = status;
    }
};

const show_residence_form = function() {
    const residenceForm = $('#residence-form');
    const residenceDisabled = $('#residence');
    residenceDisabled.insertAfter('#move-residence-here');
    $('#error-residence').insertAfter('#residence');
    residenceDisabled.removeAttr('disabled');
    residenceForm.show();
    residenceForm.submit(function(evt) {
        evt.preventDefault();
        const residence_value = residenceDisabled.val();
        if (Validate.fieldNotEmpty(residence_value, document.getElementById('error-residence'))) {
            Client.set_cookie('residence', residence_value);
            Client.set('residence', residence_value);
            BinarySocket.send({ set_settings: 1, residence: residence_value });
        }
    });
};

const generateState = function() {
    const state = document.getElementById('address_state');
    if (state.length !== 0) return;
    appendTextValueChild(state, Content.localize().textSelect, '');
    if (Client.get('residence') !== '') {
        BinarySocket.send({ states_list: Client.get('residence') });
    }
};

const handleResidence = function() {
    generateBirthDate();
    BinarySocket.init({
        onmessage: function(msg) {
            let select;
            const response = JSON.parse(msg.data),
                type = response.msg_type,
                residenceDisabled = $('#residence');
            if (type === 'set_settings') {
                const errorElement = document.getElementById('error-residence');
                if (response.hasOwnProperty('error')) {
                    if (response.error.message) {
                        elementInnerHtml(errorElement, response.error.message);
                        errorElement.setAttribute('style', 'display:block');
                    }
                } else {
                    errorElement.setAttribute('style', 'display:none');
                    BinarySocket.send({ landing_company: Client.get('residence') });
                }
            } else if (type === 'landing_company') {
                Cookies.set('residence', Client.get('residence'), { domain: '.' + document.domain.split('.').slice(-2).join('.'), path: '/' });
                if (((Client.can_upgrade_gaming_to_financial(response.landing_company) && !Client.get('is_virtual')) || Client.can_upgrade_virtual_to_financial(response.landing_company)) && !/maltainvestws/.test(window.location.href)) {
                    window.location.href = url_for('new_account/maltainvestws');
                } else if (Client.can_upgrade_virtual_to_japan(response.landing_company) && Client.get('is_virtual') && !/japanws/.test(window.location.href)) {
                    window.location.href = url_for('new_account/japanws');
                } else if (!$('#real-form').is(':visible')) {
                    BinarySocket.send({ residence_list: 1 });
                    $('#residence-form').hide();
                    residenceDisabled.insertAfter('#move-residence-back');
                    $('#error-residence').insertAfter('#residence');
                    residenceDisabled.attr('disabled', 'disabled');
                    generateState();
                    $('#real-form').show();
                }
            } else if (type === 'states_list') {
                select = $('#address_state');
                const states = response.states_list;

                select.empty();

                if (states && states.length > 0) {
                    states.forEach(function(state) {
                        select.append($('<option/>', { value: state.value, text: state.text }));
                    });
                } else {
                    select.replaceWith($('<input/>', { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35', class: 'form_input' }));
                }
                $('#address_state').parent().parent().show();
                if (window.state) {
                    $('#address_state').val(window.state);
                }
            } else if (type === 'residence_list') {
                select = document.getElementById('residence');
                const phoneElement   = document.getElementById('phone'),
                    residenceValue = Client.get('residence'),
                    residence_list = response.residence_list;
                if (residence_list.length > 0) {
                    for (let j = 0; j < residence_list.length; j++) {
                        const residence = residence_list[j];
                        if (select) {
                            appendTextValueChild(select, residence.text, residence.value, residence.disabled ? 'disabled' : undefined);
                        }
                        if (residenceValue !== 'jp' && phoneElement && phoneElement.value === '' && residence.phone_idd && residenceValue === residence.value) {
                            phoneElement.value = '+' + residence.phone_idd;
                        }
                    }
                    if (residenceValue && select) {
                        select.value = residenceValue;
                    }
                    if (document.getElementById('virtual-form')) {
                        BinarySocket.send({ website_status: 1 });
                    }
                }
            } else if (type === 'website_status') {
                const status  = response.website_status,
                    $residence = $('#residence');
                if (status && status.clients_country) {
                    const clientCountry = $residence.find('option[value="' + status.clients_country + '"]');
                    if (!clientCountry.attr('disabled')) {
                        clientCountry.prop('selected', true);
                    }
                    const email_consent_parent = $('#email_consent').parent().parent();
                    if (status.clients_country === 'jp' || japanese_client()) {
                        if (!document.getElementById('japan-label')) $residence.parent().append('<label id="japan-label">' + localize('Japan') + '</label>');
                        email_consent_parent.removeClass('invisible');
                    } else {
                        $residence.removeClass('invisible')
                            .on('change', function() {
                                if ($(this).val() === 'jp') {
                                    email_consent_parent.removeClass('invisible');
                                } else {
                                    email_consent_parent.addClass('invisible');
                                }
                            });
                    }
                }
            } else if (type === 'get_financial_assessment' && objectNotEmpty(response.get_financial_assessment)) {
                const keys = Object.keys(response.get_financial_assessment);
                keys.forEach(function(key) {
                    const val = response.get_financial_assessment[key];
                    $('#' + key).val(val);
                });
            }
        },
    });
};

const populateObjects = () => {
    const elementObj = {};
    const errorObj = {};
    const all_ids = $('.form_input');
    for (let i = 0; i < all_ids.length; i++) {
        const id = all_ids[i].getAttribute('id');
        let error_id = 'error_' + id;
        elementObj[id] = document.getElementById(id);
        // all date of birth fields share one error message element
        if (/dob(mm|yy)/.test(id)) {
            error_id = 'error_dobdd';
        }
        errorObj[id] = document.getElementById(error_id);
    }
    return {
        elementObj: elementObj,
        errorObj  : errorObj,
    };
};

const hideAllErrors = (errorObj, errorEl) => {
    window.accountErrorCounter = 0;
    if (errorEl) {
        errorEl.innerHTML = '';
        errorEl.parentNode.parentNode.parentNode.hide();
    }
    Object.keys(errorObj).forEach(function (key) {
        if (errorObj[key] && errorObj[key].offsetParent !== null) {
            errorObj[key].setAttribute('style', 'display:none');
        }
    });
};

const checkRequiredInputs = (elementObj, errorObj, optional_fields) => {
    Object.keys(elementObj).forEach(function (key) {
        if (elementObj[key].offsetParent !== null && optional_fields.indexOf(key) < 0) {
            if (/^$/.test((elementObj[key].value).trim()) && elementObj[key].type !== 'checkbox') {
                errorObj[key].innerHTML = Content.errorMessage('req');
                Validate.displayErrorMessage(errorObj[key]);
                window.accountErrorCounter++;
            }
            if (elementObj[key].type === 'checkbox' && !elementObj[key].checked) {
                errorObj[key].innerHTML = Content.errorMessage('req');
                Validate.displayErrorMessage(errorObj[key]);
                window.accountErrorCounter++;
            }
        }
    });
};


module.exports = {
    displayAcctSettings: displayAcctSettings,
    handleResidence    : handleResidence,
    populateObjects    : populateObjects,
    hideAllErrors      : hideAllErrors,
    checkRequiredInputs: checkRequiredInputs,
};

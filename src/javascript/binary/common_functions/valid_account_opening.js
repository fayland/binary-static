const Validate    = require('./validation').Validate;
const isValidDate = require('./common_functions').isValidDate;
const Content     = require('./content').Content;
const Cookies     = require('../../lib/js-cookie');
const localize    = require('../base/localize').localize;
const Client      = require('../base/client').Client;
const Contents    = require('../base/contents').Contents;
const url_for     = require('../base/url').url_for;
const elementInnerHtml = require('./common_functions').elementInnerHtml;

const ValidAccountOpening = (function() {
    const redirectCookie = function() {
        if (Contents.show_login_if_logout(true)) {
            return;
        }
        if (!Client.get('is_virtual')) {
            window.location.href = url_for('trading');
            return;
        }
        const client_loginid_array = Client.get('loginid_array');
        for (let i = 0; i < client_loginid_array.length; i++) {
            if (client_loginid_array[i].real === true) {
                window.location.href = url_for('trading');
                return;
            }
        }
    };
    const handler = function(response, message_type) {
        if (response.error) {
            const errorMessage = response.error.message;
            if (response.error.code === 'show risk disclaimer' && document.getElementById('financial-form')) {
                $('#financial-form').addClass('hidden');
                $('#financial-risk').removeClass('hidden');
                return;
            }
            $('#submit-message').empty();
            const error = document.getElementsByClassName('notice-msg')[0];
            elementInnerHtml(error, (response.msg_type === 'sanity_check') ? localize('There was some invalid character in an input field.') : errorMessage);
            error.parentNode.parentNode.parentNode.show();
        } else if (Cookies.get('residence') === 'jp') {
            window.location.href = url_for('new_account/knowledge_testws');
            $('#topbar-msg').children('a').addClass('invisible');
        } else {     // jp account require more steps to have real account
            Client.process_new_account(Cookies.get('email'), response[message_type].client_id, response[message_type].oauth_token, false);
        }
    };
    let letters,
        numbers,
        space,
        hyphen,
        period,
        apost;

    const initializeValues = function() {
        if (!letters) {
            letters = Content.localize().textLetters;
            numbers = Content.localize().textNumbers;
            space   = Content.localize().textSpace;
            hyphen  = Content.localize().textHyphen;
            period  = Content.localize().textPeriod;
            apost   = Content.localize().textApost;
        }
    };

    const checkFname = function(fname, errorFname) {
        if ((fname.value).trim().length < 2) {
            elementInnerHtml(errorFname, Content.errorMessage('min', '2'));
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(fname.value)) {
            initializeValues();
            elementInnerHtml(errorFname, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorFname);
            window.accountErrorCounter++;
        }
    };
    const checkLname = function(lname, errorLname) {
        if ((lname.value).trim().length < 2) {
            elementInnerHtml(errorLname, Content.errorMessage('min', '2'));
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(lname.value)) {
            initializeValues();
            elementInnerHtml(errorLname, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorLname);
            window.accountErrorCounter++;
        }
    };
    const checkDate = function(dobdd, dobmm, dobyy, errorDob) {
        if (!isValidDate(dobdd.value, dobmm.value, dobyy.value) || dobdd.value === '' || dobmm.value === '' || dobyy.value === '') {
            elementInnerHtml(errorDob, Content.localize().textErrorBirthdate);
            Validate.displayErrorMessage(errorDob);
            window.accountErrorCounter++;
        }
    };
    const checkPostcode = function(postcode, errorPostcode) {
        if ((postcode.value !== '' || Client.get('residence') === 'gb') && !/^[a-zA-Z\d-]+$/.test(postcode.value)) {
            initializeValues();
            elementInnerHtml(errorPostcode, Content.errorMessage('reg', [letters, numbers, hyphen]));
            Validate.displayErrorMessage(errorPostcode);
            window.accountErrorCounter++;
        }
    };
    const checkTel = function(tel, errorTel) {
        if (tel.value.replace(/\+| /g, '').length < 6) {
            elementInnerHtml(errorTel, Content.errorMessage('min', 6));
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        } else if (!/^\+?[0-9\s]{6,35}$/.test(tel.value)) {
            initializeValues();
            elementInnerHtml(errorTel, Content.errorMessage('reg', [numbers, space]));
            Validate.displayErrorMessage(errorTel);
            window.accountErrorCounter++;
        }
    };
    const checkAnswer = function(answer, errorAnswer) {
        if (answer.value.length < 4) {
            elementInnerHtml(errorAnswer, Content.errorMessage('min', 4));
            Validate.displayErrorMessage(errorAnswer);
            window.accountErrorCounter++;
        } else if (!/^[\w\-\,\.\' ]{4,50}$/.test(answer.value)) {
            initializeValues();
            elementInnerHtml(errorAnswer, Content.errorMessage('reg', [letters, numbers, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorAnswer);
            window.accountErrorCounter++;
        }
    };
    const checkCity = function(city, errorCity) {
        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(city.value)) {
            initializeValues();
            elementInnerHtml(errorCity, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorCity);
            window.accountErrorCounter++;
        }
    };
    const checkState = function(state, errorState) {
        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><|]+/.test(state.value)) {
            initializeValues();
            elementInnerHtml(errorState, Content.errorMessage('reg', [letters, space, hyphen, period, apost]));
            Validate.displayErrorMessage(errorState);
            window.accountErrorCounter++;
        }
    };
    return {
        redirectCookie: redirectCookie,
        handler       : handler,
        checkFname    : checkFname,
        checkLname    : checkLname,
        checkDate     : checkDate,
        checkPostcode : checkPostcode,
        checkTel      : checkTel,
        checkAnswer   : checkAnswer,
        checkCity     : checkCity,
        checkState    : checkState,
    };
})();

module.exports = {
    ValidAccountOpening: ValidAccountOpening,
};

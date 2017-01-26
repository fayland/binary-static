const VerifyEmail = require('../websocket_pages/user/verify_email').VerifyEmail;
const Client = require('../base/client').Client;

const Home = (function() {
    const init = function() {
        if (!Client.redirect_if_login()) {
            check_login_hide_signup();
            VerifyEmail();
        }
    };
    const check_login_hide_signup = function() {
        if (Client.is_logged_in()) {
            $('#verify-email-form').remove();
            $('.break').attr('style', 'margin-bottom:1em');
        }
    };
    return {
        init: init,
    };
})();

module.exports = {
    Home: Home,
};

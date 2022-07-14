define([
    'jquery',
    'ko',
    'uiComponent',
    'underscore',
    'Magento_Checkout/js/model/step-navigator',
    'Magento_Customer/js/model/customer',
    'Magento_Customer/js/action/check-email-availability',
    'Magento_Customer/js/action/login',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/checkout-data',
    'Magento_Checkout/js/model/full-screen-loader',
    'mage/translate',
    'mage/validation'
], function ($, ko, Component, _, stepNavigator, customer, checkEmailAvailability, loginAction, quote, checkoutData, fullScreenLoader, $t) {
    'use strict';

    /**
     * mystep - is the name of the component's .html template,
     * <Vendor>_<Module>  - is the name of your module directory.
     */
    return Component.extend({
        defaults: {
            template: 'ChintakExtensions_Checkout/customlogin',
            email: checkoutData.getInputFieldEmailValue(),
            isPasswordVisible: false,
        },
        emailFocused: 'validateEmail',
        forgotPasswordUrl: window.checkoutConfig.forgotPasswordUrl,
        registerUrl: window.checkoutConfig.registerUrl,

        // add here your logic to display step,
        isVisible: ko.observable(true),
        islogin: ko.observable(customer.isLoggedIn()? "login" : "notlogin"),

        /**
         * @returns {*}
         */
        initialize: function () {
            this._super();

            // register your step
            stepNavigator.registerStep(
                'login',
                null,
                'Login',
                this.isVisible,
                _.bind(this.navigate, this),
                5
            );
            return this;
        },

        initObservable: function () {
            this._super().observe(['email', 'isPasswordVisible']);

            return this;
        },

        login: function (loginForm) {
            var loginData = {},
                formDataArray = $(loginForm).serializeArray();

            formDataArray.forEach(function (entry) {
                loginData[entry.name] = entry.value;
            });

            if (this.isPasswordVisible() && $(loginForm).validation() && $(loginForm).validation('isValid')) {
                fullScreenLoader.startLoader();
                loginAction(loginData).always(function () {
                    fullScreenLoader.stopLoader();
                });
            }
        },

        validateEmail: function (focused) {
            var loginFormSelector = 'form[data-role=email-with-possible-login]',
                usernameSelector = loginFormSelector + ' input[name=username]',
                loginForm = $(loginFormSelector),
                validator,
                valid;

            loginForm.validation();

            if (focused === false && !!this.email()) {
                valid = !!$(usernameSelector).valid();

                if (valid) {
                    $(usernameSelector).removeAttr('aria-invalid aria-describedby');
                }

                return valid;
            }

            if (loginForm.is(':visible')) {
                validator = loginForm.validate();

                return validator.check(usernameSelector);
            }

            return true;
        },

        showPassword: function() {
            this.isPasswordVisible(true);
            checkoutData.setCheckedEmailValue('');
        },

        /**
         * The navigate() method is responsible for navigation between checkout steps
         * during checkout. You can add custom logic, for example some conditions
         * for switching to your custom step
         * When the user navigates to the custom step via url anchor or back button we_must show step manually here
         */
        navigate: function (step) {
            this.isVisible(true);
        },

        /**
         * @returns void
         */
        navigateToNextStep: function () {
            stepNavigator.next();
        },

        continueToNextStep: function () {
            if (this.validateEmail()) {
                $('#customer-email-custom-error').hide();
                checkoutData.setCheckedEmailValue(this.email());
                checkoutData.setInputFieldEmailValue(this.email());
                quote.guestEmail = this.email();
                stepNavigator.next();
            }
            else
            {
                $('#customer-email-custom-error').show();
            }
        },

        goToNextStep: function () {
            if(customer.isLoggedIn()){
                window.location.hash = "shipping";
            }
        }
    });
});

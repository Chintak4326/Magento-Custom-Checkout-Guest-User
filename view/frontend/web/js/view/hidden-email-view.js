define([
    'jquery',
    'ko',
    'uiComponent',
    'underscore',
    'Magento_Checkout/js/checkout-data',
    'mage/translate',
], function ($, ko, Component, _, checkoutData) {
    'use strict';

    /**
     * mystep - is the name of the component's .html template,
     * <Vendor>_<Module>  - is the name of your module directory.
     */
    return Component.extend({
        defaults: {
            template: 'ChintakExtensions_Checkout/hiddenemail',
            email: checkoutData.getInputFieldEmailValue(),
        },
        isVisible: ko.observable(true),

        initObservable: function () {
            this._super().observe(['email']);
            return this;
        }
    });
});

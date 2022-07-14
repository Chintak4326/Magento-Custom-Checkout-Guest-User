var config = {
    'config': {
        'mixins': {
           'Magento_Checkout/js/view/shipping': {
               'ChintakExtensions_Checkout/js/view/shipping-payment-mixin': true
           },
           'Magento_Checkout/js/view/payment': {
               'ChintakExtensions_Checkout/js/view/shipping-payment-mixin': true
           }
       }
    }
}

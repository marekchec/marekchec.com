(function() {
    'use strict';

    angular
        .module('PFX.app')
        .config(ContactRoute);

    /* @ngInject */

    function ContactRoute(
        $stateProvider,
        AppRouteConstant
    ) {
        $stateProvider.state(AppRouteConstant.CONTACT, {
            url: '/contact',
            views: {
                'main@': {
                    controller: 'ContactController',
                    templateUrl: '/components/contact/contact.html'
                }
            }
        });
    }

}());
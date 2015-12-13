(function() {
    'use strict';

    angular
        .module('PFX.app')
        .config(AppConfig);

    /* @ngInject */

    function AppConfig(
        $stateProvider,
        $urlRouterProvider,
        $urlMatcherFactoryProvider,
        AppRouteConstant
    ) {

        $urlRouterProvider.otherwise('/');
        $urlMatcherFactoryProvider.strictMode(false);

        // -------------------------------------------------------------------
        // Base route
        // -------------------------------------------------------------------

        $stateProvider.state(AppRouteConstant.BASE, {
            abstract: true,
            views: {
                'header@': {
                    templateUrl: '/components/app/templates/header.html'
                },
                'main@': {
                    template: '<div data-ui-view></div>'
                },
                'footer@': {
                    templateUrl: '/components/app/templates/footer.html'
                }
            }
        });
    }

}());

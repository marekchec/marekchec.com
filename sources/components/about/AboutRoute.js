(function() {
    'use strict';

    angular
        .module('PFX.app')
        .config(AboutRoute);

    /* @ngInject */

    function AboutRoute(
        $stateProvider,
        AppRouteConstant
    ) {
        $stateProvider.state(AppRouteConstant.ABOUT, {
            url: '/about',
            views: {
                'main@': {
                    controller: 'AboutController',
                    templateUrl: '/components/about/about.html'
                }
            }
        });
    }

}());
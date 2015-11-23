(function() {
    'use strict';

    angular
        .module( 'PFX.app' )
        .config( StartRoute );

    /* @ngInject */

    function StartRoute(
        $stateProvider,
        AppRouteConstant
    ) {
        $stateProvider.state(AppRouteConstant.START, {
            url: '',
            views: {
                'main@': {
                    templateUrl: '/components/start/start.html'
                }
            }
        });
    }

}());
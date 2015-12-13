(function() {
    'use strict';

    angular
        .module('PFX.app')
        .controller('AppController', AppController);

    /* @ngInject */

    function AppController(
        $rootScope,
        $translate,
        AppRouteConstant
    ) {

        // ------------------------------------------------------------
        //  Private methods
        // ------------------------------------------------------------

        /**
         * Initialize controller
         * @private
         */
        function _initialize() {

            $rootScope.routeConstant = AppRouteConstant;

            $rootScope.currentLanguage = $translate.proposedLanguage();
        }

        // ------------------------------------------------------------
        //  Initialize
        // ------------------------------------------------------------

        _initialize();

    }

})();
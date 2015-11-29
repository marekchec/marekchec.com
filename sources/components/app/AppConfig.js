(function(){
    'use strict';

    angular
        .module('PFX.app')
        .config(AppConfig);

    /* @ngInject */

    function AppConfig(
        $translateProvider
    ) {
        var LOCALE_URL = '../../sources/';

        $translateProvider.preferredLanguage('de_DE');
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useStaticFilesLoader({
            prefix: LOCALE_URL + 'locales/',
            suffix: '.json'
        });
    }

})();
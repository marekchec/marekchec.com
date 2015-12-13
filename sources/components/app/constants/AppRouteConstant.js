(function() {
    'use strict';

    angular
        .module('PFX.app')
        .constant('AppRouteConstant', {
            BASE: 'base',
            START: 'base.start',
            CONTACT: 'base.contact',
            ABOUT: 'base.about'
        });

}());
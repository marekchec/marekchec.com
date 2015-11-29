(function() {
    'use strict';

    angular
        .module('SvgIcon')
        .directive('svgIcon', SvgDirective);

    /* @ngInject */

    function SvgDirective() {
        return {
            link: link,
            replace: true,
            restrict: 'AE'
        }

        function link(scope, element, attributes) {
            var symbolSource = document.getElementById('icon-' + attributes.name);
            var symbol = angular.element(symbolSource).clone();
            var svg = angular.element(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));

            svg.append(symbol.children());
            svg[0].setAttribute('viewBox', symbol[0].getAttribute('viewBox'));

            element.append(svg);
        };
    }

}());
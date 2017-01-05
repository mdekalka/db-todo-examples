(function() {
    'use strict';

    angular.module('app').directive('testDirective', function($window) {
        return {
            template: '<div>Click me</div>',
            scope: {},
            link: function(scope, elem, attrs) {
            }
        }
    })
})();
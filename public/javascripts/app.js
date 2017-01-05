(function() {
    'use strict';
    
    var app = angular.module('app', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('movies', {
                url: '/movies/:id',
                component: 'movie',
            });
    });


})();
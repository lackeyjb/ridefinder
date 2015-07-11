(function () {

  'use strict';

  angular
    .module('app', [
      'app.home',
      'app.auth',
      'ui.router',
      'mm.foundation',
      'satellizer'
    ])
    .config([
      '$httpProvider',
      '$authProvider',
      '$urlRouterProvider',
      '$locationProvider',
      appConfig
    ]);

  function appConfig ($httpProvider, $authProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $authProvider.baseUrl = '/api';

    $authProvider.facebook({
      clientId: '1545306165733860'
    });
  }

})();

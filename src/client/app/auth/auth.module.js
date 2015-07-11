(function() {

  'use strict';

  angular
    .module('app.auth', ['ui.router'])
    .config(['$stateProvider', authConfig]);

  function authConfig ($stateProvider) {
    $stateProvider
      .state('/login', {
        url: '/login',
        templateUrl: 'app/auth/auth-login.html',
        controller: 'Login',
        controllerAs: 'vm'
      });
  }

})();

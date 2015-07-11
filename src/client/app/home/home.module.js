(function() {

  'use strict';

  angular
    .module('app.home', ['ui.router'])
    .config(['$stateProvider', homeConfig]);

  function homeConfig ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        controller: 'Home',
        controllerAs: 'vm'
      });
  }

})();

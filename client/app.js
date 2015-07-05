angular.module('rideApp', ['ui.router']);

function configRoutes ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './views/home.html',
      controller: 'homeCtrl',
      controllerAs: 'vm'
    });
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}

angular
  .module('rideApp')
  .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', configRoutes]);

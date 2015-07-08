(function () {

  angular.module('rideApp', ['ui.router', 'satellizer', 'mm.foundation']);

  function configRoutes ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: './views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '.views/signup.html',
        controller: 'signupCtrl',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'logoutCtrl',
        controllerAs: 'vm'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: './views/profile.html',
        controller: 'profileCtrl',
        controllerAs: 'vm',
        resolve: {
          authenticated: function ($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }
            return deferred.promise;
          }
        }
      });

      $urlRouterProvider.otherwise('/');

      $authProvider.baseUrl = '/api';

      $authProvider.facebook({
        clientId: '1545306165733860'
      });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
  }

  angular
    .module('rideApp')
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', configRoutes]);

})();

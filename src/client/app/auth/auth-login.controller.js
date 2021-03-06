(function() {

  'use strict';

  angular
    .module('app.auth')
    .controller('Login', Login);

  Login.$inject = ['$auth'];
  function Login ($auth) {
    var vm = this;

    vm.login = function () {
      $auth
        .login({
          email: vm.email, password: vm.password
        })
        .then(function () {
          vm.message = 'You have successfully logged in!';
        })
        .catch(function (response) {
          vm.message = response.data.message;
          console.log(vm.message);
        });
    };

    vm.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function () {
          vm.message = 'You have successfully logged in!';
        })
        .catch(function (response) {
          vm.message = response.data ? response.data.message : response;
          console.log(vm.message);
        });
    };
  }

})();

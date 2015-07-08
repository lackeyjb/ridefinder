(function () {

  angular
    .module('rideApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$auth'];
  function loginCtrl ($auth) {
    var vm = this;

    vm.login = function () {
      $auth.login({ email: vm.email, password: vm.password })
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
        .catch(function (data) {
          vm.message = response.data ? response.data.message : response;
          console.log(vm.message);
        });
    };
  }

})();

(function() {
    angular.module('app').controller('InitializerCtrl', ['$scope', '$state', '$timeout', 'localStorageService',
        function($scope, $state, $timeout, localStorageService) {
            console.log('Initializing Initializer: ', $scope);

            $timeout(function() {
              localStorageService.set('splashed', (new Date().getTime()));
              $state.go('dashboard');
            }, 3000);
        }
    ]);
})();

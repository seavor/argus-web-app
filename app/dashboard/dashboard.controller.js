(function() {
    angular.module('app').controller('DashboardCtrl', ['config', '$scope', '$state', 'localStorageService',
        function(config, $scope, $state, localStorageService) {
            console.log('Initializing Dashboard: ', $scope);

            var splashed = localStorageService.get('splashed');

            if (!splashed) {
              $state.go('initializer');
              return;
            }
        }
    ]);
})();

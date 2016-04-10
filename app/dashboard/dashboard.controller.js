(function() {
    angular.module('app').controller('DashboardCtrl', ['config', '$scope', '$state', 'apngSrvc', 'localStorageService',
        function(config, $scope, $state, apngSrvc, localStorageService) {
            console.info('Initializing Dashboard Controller: ', $scope);

            $scope.thumbnails = [
              {
                id: 1,
                label: 'right leg',
                src: 'cam-thumb.png'
              }
            ];

            apngSrvc.cacheAssets().then(function() {
              $scope.assetsLoaded = true;
            });

        }
    ]);
})();

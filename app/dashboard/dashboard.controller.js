(function() {
    angular.module('app').controller('DashboardCtrl', ['$scope', '$timeout', '$state', 'apngSrvc', 'localStorageService',
        function($scope, $timeout, $state, apngSrvc, localStorageService) {
            console.info('Initializing Dashboard Controller: ', $scope);

            if (!apngSrvc.assetsCached()) {
                $state.go('initializer');
                return;
            }

            $scope.thumbnails = [
                {
                    id: 1,
                    label: 'head',
                    src: 'cam-thumb.png'
                }, {
                    id: 2,
                    label: 'right arm',
                    src: 'cam-thumb.png'
                }, {
                    id: 3,
                    label: 'left arm',
                    src: 'cam-thumb.png'
                }, {
                    id: 4,
                    label: 'right leg',
                    src: 'cam-thumb.png'
                }, {
                    id: 5,
                    label: 'left leg',
                    src: 'cam-thumb.png'
                }
            ];

            $scope.selectedFeed = $scope.thumbnails[(localStorageService.get('selectedIdx') || 0)];
            $scope.viewFeed = viewFeed;

            /************************************/

            function viewFeed(idx) {
                $timeout(function() {
                    console.log('View Feed: ', idx);
                    localStorageService.set('selectedIdx', idx);
                    $scope.selectedFeed = $scope.thumbnails[idx];
                });
            }
        }
    ]);
})();

(function() {
    angular.module('app').controller('DashboardCtrl', ['$scope', '$timeout', '$state', '$sce', 'stream', 'apngSrvc', 'suitSrvc', 'piSrvc',
        function($scope, $timeout, $state, $sce, stream, apngSrvc, suitSrvc, piSrvc) {
            console.info('Initializing Dashboard Controller: ', $scope);

            if (!apngSrvc.assetsCached()) {
                $state.go('initializer');
                return;
            }

            /*********************************************/

            $scope.cleanAsset = cleanAsset;
            $scope.viewFeed = viewFeed;

            /*********************************************/

            $scope.cams = [];

            /*********************************************/

            /*
                data: [{
                    id: [PI ID]
                    imageData: [Base64 Encoded Image]
                }]
             */
            stream.socket.on('cams', function(data) {
                $timeout(function() {
                    $scope.cams = suitSrvc.feeds = data;
                });
            });

            /*
                data: {
                    id: [PI ID]
                    imageData: [Base64 Encoded Image]
                }
             */
            stream.socket.on('mainFeed', function(data) {
                $timeout(function() {
                    $scope.mainFeed = data;
                });
            });

            /************************************/

            function viewFeed(id) {
                stream.socket.emit('selectFeed', id);
            }

            function cleanAsset(asset) {
                return $sce.trustAsResourceUrl(asset);
            };
        }
    ]);
})();

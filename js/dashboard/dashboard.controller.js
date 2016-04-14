(function() {
    angular.module("app").controller("DashboardCtrl", [ "$scope", "$timeout", "$state", "$sce", "stream", "apngSrvc", "localStorageService", "piSrvc", function($scope, $timeout, $state, $sce, stream, apngSrvc, localStorageService, piSrvc) {
        console.info("Initializing Dashboard Controller: ", $scope);
        if (!apngSrvc.assetsCached()) {
            $state.go("initializer");
            return;
        }
        if (localStorageService.get("mainFeed")) {
            viewFeed(localStorageService.get("mainFeed"));
        }
        $scope.cleanAsset = cleanAsset;
        $scope.viewFeed = viewFeed;
        $scope.camLabels = {
            1: "Cam Label",
            2: "Cam Label",
            3: "Cam Label",
            4: "Cam Label",
            5: "Cam Label",
            6: "Cam Label",
            7: "Cam Label"
        };
        $scope.cams = [];
        stream.socket.on("cams", function(data) {
            $timeout(function() {
                $scope.cams = data;
            });
        });
        stream.socket.on("mainFeed", function(data) {
            $timeout(function() {
                $scope.mainFeed = data;
            });
        });
        function viewFeed(id) {
            stream.socket.emit("selectFeed", id);
            localStorageService.set("mainFeed", id);
        }
        function cleanAsset(asset) {
            return $sce.trustAsResourceUrl(asset);
        }
    } ]);
})();
(function() {
    angular.module("app").controller("DashboardCtrl", [ "config", "$scope", "$state", "localStorageService", function(config, $scope, $state, localStorageService) {
        if (!localStorageService.get("splashed")) {
            $state.go("initializer");
            return;
        }
        console.log("Initializing Dashboard: ", $scope);
        $scope.thumbnails = [ {
            id: 1,
            label: "right leg",
            src: "cam-thumb.png"
        } ];
    } ]);
})();
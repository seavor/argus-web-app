(function() {
    angular.module("app").controller("ApplicationCtrl", [ "config", "$scope", "$state", "localStorageService", function(config, $scope, $state, localStorageService) {
        console.log("Initializing Application: ", $scope);
        $scope.config = config;
    } ]);
})();
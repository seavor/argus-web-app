(function() {
    angular.module("app").controller("ApplicationCtrl", [ "config", "$scope", "$state", "localStorageService", function(config, $scope, $state, localStorageService) {
        console.info("Initializing Application Controller: ", $scope);
        $scope.config = config;
    } ]);
})();
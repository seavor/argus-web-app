(function() {
    angular.module("app").controller("InitializerCtrl", [ "$scope", "$state", "$timeout", "apngSrvc", "localStorageService", function($scope, $state, $timeout, apngSrvc, localStorageService) {
        console.info("Initializing Initializer Controller: ", $scope);
        apngSrvc.cacheAssets().then(function() {
            localStorageService.set("initialized", new Date().getTime());
            $state.go("dashboard");
        });
    } ]);
})();
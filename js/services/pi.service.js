(function() {
    angular.module("app").factory("piSrvc", [ "config", "$q", "stream", "$rootScope", "$state", "$timeout", "localStorageService", function(config, $q, stream, $rootScope, $state, $timeout, localStorageService) {
        console.info("Initializing Mock PI Service");
        var factory = {
            launchPi: launchPi
        };
        return factory;
        function launchPi() {
            stream.socket.emit("memePi");
        }
    } ]);
})();
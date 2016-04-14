(function() {
    angular.module("app").factory("stream", [ "config", "$q", "$http", "$rootScope", "$state", "$timeout", "localStorageService", function(config, $q, $http, $rootScope, $state, $timeout, localStorageService) {
        console.info("Initialize Stream Connection");
        var socket = io.connect(window.location.origin + ":8080"), factory = {
            socket: socket
        };
        socket.on("connect", function() {
            console.info("Websocket Connection Established");
            socket.emit("who", "client");
        });
        return factory;
    } ]);
})();
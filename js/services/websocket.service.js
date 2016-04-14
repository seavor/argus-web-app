(function() {
    angular.module("app").factory("webSocket", [ "config", "$q", "$http", "$rootScope", "$state", "$timeout", "localStorageService", function(config, $q, $http, $rootScope, $state, $timeout, localStorageService) {
        console.info("Initialize Websocket Connection");
        var factory = {
            selectFeed: selectFeed
        }, socket = io.connect(window.location.origin + ":8080"), pis = [], mainFeed;
        console.log(socket);
        socket.on("connect", function() {
            console.info("Websocket Connection Established");
            socket.emit("who", "web");
        });
        socket.on("pis", function(data) {
            console.log("PI Feeds: ", data);
            pis = data;
            $rootScope.$broadcast("socket:pis", data);
        });
        socket.on("image", function(data) {
            console.log("Main Feed");
            mainFeed = data.id;
            $rootScope.$broadcast("socket:mainFeed", data);
        });
        return factory;
        function selectFeed(id) {
            socket.emit("highquality", id);
        }
    } ]);
})();
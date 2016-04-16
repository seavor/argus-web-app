(function() {
    angular.module("app").factory("suitSrvc", [ "config", "$q", "$http", "$rootScope", "$state", "$timeout", "localStorageService", "stream", function(config, $q, $http, $rootScope, $state, $timeout, localStorageService, stream) {
        console.info("Initializing Suit Service");
        var factory = {
            getEyes: getEyes,
            selectFeedByPosition: selectFeedByPosition,
            mainFeed: null
        }, eyes = [ {
            filename: "eyes.002.obj",
            active: true,
            side: "center",
            position: "head"
        }, {
            filename: "eyes.023.obj",
            active: true,
            side: "right",
            position: "ear"
        }, {
            filename: "eyes.022.obj",
            active: true,
            side: "left",
            position: "ear"
        }, {
            filename: "eyes.010.obj",
            active: true,
            side: "right",
            position: "shoulder"
        }, {
            filename: "eyes.021.obj",
            active: true,
            side: "left",
            position: "shoulder"
        }, {
            filename: "eyes.008.obj",
            active: true,
            side: "right",
            position: "hand"
        }, {
            filename: "eyes.003.obj",
            active: true,
            side: "left",
            position: "hand"
        }, {
            filename: "eyes.014.obj",
            active: true,
            side: "center",
            position: "chest"
        }, {
            filename: "eyes.017.obj",
            active: true,
            side: "center",
            position: "upperback"
        }, {
            filename: "eyes.018.obj",
            active: true,
            side: "center",
            position: "lowerback"
        }, {
            filename: "eyes.012.obj",
            active: true,
            side: "right",
            position: "thigh"
        }, {
            filename: "eyes.006.obj",
            active: true,
            side: "left",
            position: "thigh"
        } ];
        return factory;
        function getEyes() {
            return eyes;
        }
        function selectFeedByPosition(position, side) {
            angular.forEach(eyes, function(eye) {
                if (eye.position === position && !side || eye.side === side) {
                    console.log(eye);
                    stream.socket.emit("selectFeed", eye.id);
                    suitSrvc.mainFeed = eye.id;
                }
            });
        }
    } ]);
})();
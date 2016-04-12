(function() {
    angular.module("app").factory("suitSrvc", [ "config", "$q", "$http", "$rootScope", "$state", "$timeout", "localStorageService", function(config, $q, $http, $rootScope, $state, $timeout, localStorageService) {
        console.info("Initializing Suit Service");
        var factory = {
            getEyes: getEyes
        }, eyes = [ {
            filename: "eyes.002.obj",
            playing: false,
            bodyside: "left",
            bodyposition: "leftshoulder"
        }, {
            filename: "eyes.003.obj",
            playing: false,
            bodyside: "left",
            bodyposition: "lefthandfront"
        }, {
            filename: "eyes.004.obj",
            playing: false,
            bodyside: "center",
            bodyposition: "stomach"
        }, {
            filename: "eyes.006.obj",
            playing: false,
            bodyside: "left",
            bodyposition: "leftthigh"
        }, {
            filename: "eyes.007.obj",
            playing: false,
            bodyside: "left",
            bodyposition: "leftshin"
        }, {
            filename: "eyes.008.obj",
            playing: false,
            bodyside: "right",
            bodyposition: "righthandfront"
        }, {
            filename: "eyes.010.obj",
            playing: false,
            bodyside: "right",
            bodyposition: "rightshoulder"
        }, {
            filename: "eyes.012.obj",
            playing: false,
            bodyside: "right",
            bodyposition: "rightthigh"
        }, {
            filename: "eyes.013.obj",
            playing: false,
            bodyside: "right",
            bodyposition: "rightshin"
        }, {
            filename: "eyes.014.obj",
            playing: false,
            bodyside: "center",
            bodyposition: "chest"
        }, {
            filename: "eyes.017.obj",
            playing: false,
            bodyside: "center",
            bodyposition: "backofneck"
        }, {
            filename: "eyes.018.obj",
            playing: false,
            bodyside: "center",
            bodyposition: "lowback"
        }, {
            filename: "eyes.021.obj",
            playing: false,
            bodyside: "center",
            bodyposition: "forehead"
        }, {
            filename: "eyes.022.obj",
            playing: false,
            bodyside: "left",
            bodyposition: "leftear"
        }, {
            filename: "eyes.023.obj",
            playing: false,
            bodyside: "right",
            bodyposition: "rightear"
        } ];
        return factory;
        function getEyes() {
            return eyes;
        }
    } ]);
})();
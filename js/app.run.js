(function() {
    angular.module("app").run([ "$rootScope", "$state", "config", function($rootScope, $state, config) {
        console.info("Running Application");
        $rootScope.app = {
            title: config.site
        };
        $rootScope.$on("$stateChangeStart", function(event, to, toParams, from, fromParams) {
            $rootScope.app.title = config.site + " | Loading...";
        });
        $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
            $rootScope.app.title = config.site + " | " + (to.name.substring(0, 1).toUpperCase() + to.name.substring(1, to.name.length));
        });
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, err) {
            console.error("Oops..");
        });
        (function openWebSocket() {
            var socket = io.connect(), pis = [], images = [];
            socket.on("connect", function() {
                console.log("Connected");
                socket.emit("who", "web");
            });
            socket.on("pis", function(data) {
                console.log(data);
                pis = data;
                if (pis.length > 0) {
                    socket.emit("highquality", pis[0]);
                }
            });
            socket.on("image", function(data) {
                console.log(data);
                for (var i = 0; i < pis.length; i++) {
                    if (data.pi_id == pis[i]) {
                        console.log("matched " + i);
                        images[i].src = data.imagedata;
                        break;
                    }
                }
            });
            $rootScope.$on("$viewContentLoaded", function() {
                console.log("Run Content");
            });
        })();
    } ]);
})();
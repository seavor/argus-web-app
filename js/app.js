(function() {
    angular.module("app", []).constant("config", {
        site: "Argus"
    }).config([ "$locationProvider", "$urlRouterProvider", "$stateProvider", "localStorageServiceProvider", "config", function ApplicationConfiguration($locationProvider, $urlRouterProvider, $stateProvider, localStorageServiceProvider, config) {
        $locationProvider.html5Mode(true);
        localStorageServiceProvider.setNotify(false).setPrefix(config.site).setStorageCookieDomain(window.location);
        $urlRouterProvider.otherwise(function($injector, $location) {
            return "/";
        });
        $stateProvider.state("init", {
            url: "",
            "abstract": true,
            controller: "ApplicationCtrl",
            views: {
                "header@": {
                    templateUrl: "app/header/header.template.html",
                    controller: "HeaderCtrl"
                },
                "footer@": {
                    templateUrl: "app/footer/footer.template.html",
                    controller: "FooterCtrl"
                }
            }
        });
        $stateProvider.state("home", {
            parent: "init",
            url: "/",
            views: {
                "content@": {
                    templateUrl: "app/home/home.template.html",
                    controller: "HomeCtrl"
                }
            }
        });
    } ]);
})();
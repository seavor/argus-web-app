(function() {
    angular.module("app", [ "ui.router", "LocalStorageModule" ]).constant("config", {
        site: "Argus"
    }).config([ "$locationProvider", "$urlRouterProvider", "$stateProvider", "localStorageServiceProvider", "config", function ApplicationConfiguration($locationProvider, $urlRouterProvider, $stateProvider, localStorageServiceProvider, config) {
        console.info("Initializing Application");
        $locationProvider.html5Mode(true);
        localStorageServiceProvider.setNotify(false).setPrefix(config.site).setStorageCookieDomain(window.location);
        $urlRouterProvider.otherwise(function($injector, $location) {
            if (!$injector.get("localStorageService").get("splashed")) {
                return "/initializer";
            } else {
                return "/";
            }
        });
        $stateProvider.state("init", {
            url: "",
            "abstract": true,
            controller: "ApplicationCtrl",
            template: "<ui-view />"
        });
        $stateProvider.state("initializer", {
            parent: "init",
            url: "/initializer",
            controller: "InitializerCtrl",
            templateUrl: "app/initializer/initializer.template.html"
        });
        $stateProvider.state("dashboard", {
            parent: "init",
            url: "/",
            controller: "DashboardCtrl",
            templateUrl: "app/dashboard/dashboard.template.html"
        });
    } ]);
})();
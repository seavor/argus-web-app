(function() {
    angular.module("app", [ "ui.router", "LocalStorageModule" ]).constant("config", {
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
            template: "<ui-view />"
        });
        $stateProvider.state("home", {
            parent: "init",
            url: "/",
            controller: "HomeCtrl",
            templateUrl: "app/home/home.template.html"
        });
    } ]);
})();
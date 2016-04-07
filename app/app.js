(function() {
    angular.module('app', ['ui.router', 'LocalStorageModule'])
        .constant('config', {
            site: 'Argus'
        })
        .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'localStorageServiceProvider', 'config',
        function ApplicationConfiguration($locationProvider, $urlRouterProvider, $stateProvider, localStorageServiceProvider, config) {
            // Setup HTML5 mode, so that the # is not present in the URL.
            $locationProvider.html5Mode(true);

            // Configure Local Storage
            localStorageServiceProvider
                .setNotify(false)
                .setPrefix(config.site)
                .setStorageCookieDomain(window.location);

            // If we did not find a valid url, redirect to home page
            $urlRouterProvider.otherwise(function($injector, $location) {
                return '/';
            });

            $stateProvider.state("init", {
                url: "",
                abstract: true,
                controller: 'ApplicationCtrl',
                template: '<ui-view />'
            });

            $stateProvider.state("home", {
                parent: "init",
                url: "/",
                controller: "HomeCtrl",
                templateUrl: "app/home/home.template.html"
            });
        }]);
})();

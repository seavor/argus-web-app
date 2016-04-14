(function() {
    angular.module('app').run(['$rootScope', '$state', 'config', 'webSocket', function($rootScope, $state, config, webSocket) {
        console.info('Running Application');
        var ws = webSocket;

        $rootScope.app = {
            title: config.site
        };

        $rootScope.$on("$stateChangeStart", function(event, to, toParams, from, fromParams) {
            $rootScope.app.title = config.site + ' | Loading...';
        });

        $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
            $rootScope.app.title = config.site + ' | ' + (to.name.substring(0, 1).toUpperCase() + to.name.substring(1, to.name.length));
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, err) {
            console.error('Oops..');
        });

        $rootScope.$on("$viewContentLoaded", function() {
            // @TODO: Store thumbnail slots
            console.log('Run Content');
        });
    }]);
})();

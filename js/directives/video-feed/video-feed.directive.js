(function() {
    angular.module("app").directive("videoFeed", [ "$state", "$timeout", "localStorageService", function($state, $timeout, localStorageService) {
        var directive = {
            restrict: "E",
            replace: true,
            template: '<img ng-src="{{src}}">',
            link: linker,
            scope: {
                src: "="
            }
        };
        return directive;
        function linker(scope, elem, attrs) {
            console.info("Initializing Video Feed: ", scope);
        }
    } ]);
})();
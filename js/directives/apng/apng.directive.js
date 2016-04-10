(function() {
    angular.module("app").directive("apng", [ "$state", "$timeout", "localStorageService", "apngSrvc", function($state, $timeout, localStorageService, apngSrvc) {
        var directive = {
            restrict: "A",
            scope: true,
            link: linker
        };
        return directive;
        function linker(scope, elem, attrs) {
            elem.load(function() {
                apngSrvc.initImage(elem[0]);
            });
            scope.$on("$destroy", function() {
                apngSrvc.releaseImage(elem[0]);
            });
        }
    } ]);
})();
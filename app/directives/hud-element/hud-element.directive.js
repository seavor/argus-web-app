(function() {
    angular.module('app').directive('hudElement', ['$state', '$timeout', 'localStorageService',
        function($state, $timeout, localStorageService) {
            var directive = {
                restrict: 'E',
                replace: true,
                transclude: true,
                templateUrl: 'app/directives/hud-element/hud-element.template.html',
                link: linker,
                scope: {
                    border: '=',
                    cover: '=',
                    contentPosition: '='
                }
            };

            return directive;

            /*************************************************/

            function linker(scope, elem, attrs) {
                // console.info('Initializing Hud Element: ', scope);
            }
        }
    ]);
})();

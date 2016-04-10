(function() {
    angular.module('app').directive('hudAnimation', ['$state', '$timeout', 'localStorageService',
        function($state, $timeout, localStorageService) {
            var directive = {
              restrict: 'E',
              replace: true,
              templateUrl: 'app/directives/hud-animation/hud-animation.template.html',
              link: linker,
              scope: {
                src: '='
              }
            };

            return directive;

            /*************************************************/

            function linker(scope, elem, attrs) {
              console.info('Initializing Hud Animation: ', scope);
            }
        }
    ]);
})();

(function() {
    angular.module('app').directive('videoFeed', ['$state', '$timeout', 'localStorageService',
        function($state, $timeout, localStorageService) {
            var directive = {
              restrict: 'E',
              replace: true,
              template: '<div />',
              link: linker
            };

            return directive;

            /*************************************************/

            function linker(scope, elem, attrs) {
              console.log('Initializing Video Feed: ', scope);
            }
        }
    ]);
})();
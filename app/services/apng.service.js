(function() {
    angular.module('app').factory('apngSrvc', ['config', '$q', '$http', '$rootScope', '$state', '$timeout', 'localStorageService',
        function(config, $q, $http, $rootScope, $state, $timeout, localStorageService) {
            console.info('Initializing APNG Service');

            var factory = {
                    initImage: initImage,
                    releaseImage: releaseImage,
                    cacheAssets: cacheAssets
                },

                inProgress = {},

                animatedImages = [],

                assets = [
                    // window.location.origin + '/images/bottom-hud.png',
                    // window.location.origin + '/images/right-hud.png',
                    // window.location.origin + '/images/borders/thumbnails.png',
                    window.location.origin + '/images/borders/video-feed.png'
                ];

            return factory;

            /*********************************************/

            function initImage(image) {
                if (AJPNG.ifNeeded() && assets.indexOf(image.src) !== -1) {
                    console.log('Init Image: ', image);
                    AJPNG.animateImage(image);
                }

                return factory;
            }

            function releaseImage(image) {
                console.log('Release Image: ', image.src);

                if (AJPNG.ifNeeded()) {
                    AJPNG.releaseCanvas(image);
                }

                return factory;
            }

            function cacheAssets() {
                var promises = [];

                angular.forEach(assets, function(url) {
                    var asset = inProgress[url] = (inProgress[url] || {
                        req: $http.get(url)
                    });

                    promises.push(asset.req);
                });

                return $q.all(promises);
            }
        }
    ]);
})();

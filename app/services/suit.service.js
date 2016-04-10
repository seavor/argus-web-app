(function() {
    angular.module('app').factory('suitSrvc', ['config', '$q', '$http', '$rootScope', '$state', '$timeout', 'localStorageService',
        function(config, $q, $http, $rootScope, $state, $timeout, localStorageService) {
            console.info('Initializing Suit Service');

            var factory = {
                    getEyes: getEyes
                },

                eyes = [
                  {
                    filename: 'eyes.001.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'leftbicep',
                  },
                  {
                    filename: 'eyes.002.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'leftshoulder',
                  },
                  {
                    filename: 'eyes.003.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'lefthandfront',
                  },
                  {
                    filename: 'eyes.004.obj',
                    playing: false,
                    bodyside: 'center',
                    bodyposition: 'stomach',
                  },
                  {
                    filename: 'eyes.005.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'lefthip',
                  },
                  {
                    filename: 'eyes.006.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'leftthigh',
                  },
                  {
                    filename: 'eyes.007.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'leftshin',
                  },
                  {
                    filename: 'eyes.008.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'righthandfront',
                  },
                  {
                    filename: 'eyes.009.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'rightbicep',
                  },
                  {
                    filename: 'eyes.010.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'rightshoulder',
                  },
                  {
                    filename: 'eyes.011.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'righthip',
                  },
                  {
                    filename: 'eyes.012.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'rightthigh',
                  },
                  {
                    filename: 'eyes.013.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'rightshin',
                  },
                  {
                    filename: 'eyes.014.obj',
                    playing: false,
                    bodyside: 'center',
                    bodyposition: 'chest',
                  },
                  {
                    filename: 'eyes.015.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'righthandback',
                  },
                  {
                    filename: 'eyes.016.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'lefthandback',
                  },
                  {
                    filename: 'eyes.017.obj',
                    playing: false,
                    bodyside: 'center',
                    bodyposition: 'backofneck',
                  },
                  {
                    filename: 'eyes.018.obj',
                    playing: false,
                    bodyside: 'center',
                    bodyposition: 'lowback',
                  },
                  {
                    filename: 'eyes.019.obj',
                    playing: false,
                    bodyside: 'left',
                    bodyposition: 'leftcalf',
                  },
                  {
                    filename: 'eyes.020.obj',
                    playing: false,
                    bodyside: 'right',
                    bodyposition: 'rightcalf',
                  },
                ];

            return factory;

            /*********************************************/

            function getEyes() {
                return eyes;
            }
        }
    ]);
})();

angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/dashboard/dashboard.template.html',
    "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p></div><div class=home-page-content><div class=body-suit><div class=body-suit-wrapper><div class=body-suit-hud></div><body-suit></body-suit></div><div class=body-suit-animation></div></div><div class=video-feed><div class=video-feed-wrapper><div class=video-feed-hud></div><video-feed></video-feed></div><div class=video-feed-animation></div><div class=video-feed-thumbnails></div></div></div></div>"
  );


  $templateCache.put('app/initializer/initializer.template.html',
    "<div class=intializer-page><h1>{{config.site}}</h1></div>"
  );

}]);

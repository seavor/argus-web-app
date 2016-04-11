angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/dashboard/dashboard.template.html',
    "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p><img class=home-page-header-map src=images/map.png apng></div><div class=home-page-content><div class=body-suit><hud-element class=body-suit-directive border=\"'images/borders/suit.svg'\" content-position=\"'\n" +
    "        width: 60%;\n" +
    "        height: 75%;\n" +
    "        top: 14%;\n" +
    "        left: 17%;\n" +
    "      '\"><body-suit class=body-suit-directive-object></body-suit></hud-element></div><div class=video-feed><hud-element class=video-feed-directive border=\"'images/video-feed.png'\" cover=true><video-feed src=\"'images/placeholder.png'\"></video-feed><span class=video-feed-label>{{selectedFeed.label}}</span></hud-element><hud-element class=video-feed-thumbnails border=\"'images/thumbnails.png'\" content-position=\"'\n" +
    "        width: 85%;\n" +
    "        height: 50%;\n" +
    "        top: 25%;\n" +
    "        left: 1%;\n" +
    "      '\"><div class=thumbnails><div class=thumbnails-track><hud-element cover=true class=thumbnails-item border=\"'images/borders/thumbnail.png'\" ng-repeat=\"thumbnail in thumbnails\" ng-click=viewFeed($index) content-position=\"'\n" +
    "                width: 94%;\n" +
    "                height: 86%;\n" +
    "                top: 5%;\n" +
    "                left: 2%;\n" +
    "              '\"><div class=thumbnails-item-image style=\"background-image: url(images/placeholder.png)\"></div></hud-element></div></div></hud-element></div></div></div>"
  );


  $templateCache.put('app/directives/hud-animation/hud-animation.template.html',
    "<div class=hud-animation><img ng-src={{src}} apng></div>"
  );


  $templateCache.put('app/directives/hud-element/hud-element.template.html',
    "<div class=hud-element><img class=hud-element-border ng-src={{border}} style=\"z-index: {{cover ? 2 : 0}}\" apng><div class=hud-element-directive style={{contentPosition}} ng-transclude></div></div>"
  );


  $templateCache.put('app/directives/video-feed/video-feed.template.html',
    ""
  );


  $templateCache.put('app/initializer/initializer.template.html',
    "<div class=initializer-page><h1>{{config.site}}</h1><p>Loading...</p></div>"
  );

}]);

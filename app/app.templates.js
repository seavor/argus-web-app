angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/dashboard/dashboard.template.html',
    "<div class=intializer ng-if=!assetsLoaded><h1>{{config.site}}</h1><p>Loading...</p></div><div class=home-page ng-if=assetsLoaded><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p></div><div class=home-page-content><div class=body-suit><hud-element class=body-suit-directive border=\"'images/borders/suit.svg'\" content-position=\"'\n" +
    "        width: 60%;\n" +
    "        height: 75%;\n" +
    "        top: 14%;\n" +
    "        left: 17%;\n" +
    "      '\"><body-suit class=body-suit-directive-object></body-suit></hud-element><hud-animation class=body-suit-animation src=\"'images/bottom-hud.svg'\"></hud-animation></div><div class=video-feed><hud-element class=video-feed-directive border=\"'http://placehold.it/1600x900'\" cover>{{selectedFeed.label}}</hud-element><hud-animation class=video-feed-animation src=\"'images/right-hud.png'\"></hud-animation><hud-element class=video-feed-thumbnails border=\"'images/borders/thumbnails.png'\" content-position=\"'\n" +
    "        width: 85%;\n" +
    "        height: 50%;\n" +
    "        top: 20%;\n" +
    "        left: 1%;\n" +
    "      '\"><div class=thumbnails><div class=thumbnails-track><hud-element cover=true class=thumbnails-item border=\"'images/borders/thumbnail.png'\" ng-repeat=\"thumbnail in thumbnails\" ng-click=viewFeed($index) content-position=\"'\n" +
    "                width: 94%;\n" +
    "                height: 86%;\n" +
    "                top: 5%;\n" +
    "                left: 2%;\n" +
    "              '\"><div class=thumbnails-item-image style=\"background-image: url(images/thumbnail.png)\"></div></hud-element></div></div></hud-element></div></div></div>"
  );


  $templateCache.put('app/directives/hud-animation/hud-animation.template.html',
    "<div class=hud-animation><img ng-src={{src}} apng></div>"
  );


  $templateCache.put('app/directives/hud-element/hud-element.template.html',
    "<div class=hud-element><img class=hud-element-border ng-src={{border}} style=\"z-index: {{cover ? 2 : 0}}\" apng><div class=hud-element-directive style={{contentPosition}} ng-transclude></div></div>"
  );

}]);

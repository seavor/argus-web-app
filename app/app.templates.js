angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/dashboard/dashboard.template.html',
    "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p><img class=home-page-header-map src=images/map.png apng></div><div class=home-page-content><div class=body-suit><hud-element class=body-suit-directive border=\"'images/borders/suit.svg'\" content-position=\"'\n" +
    "        width: 60%;\n" +
    "        height: 75%;\n" +
    "        top: 14%;\n" +
    "        left: 17%;\n" +
    "      '\"><body-suit class=body-suit-directive-object></body-suit></hud-element><hud-animation class=body-suit-animation src=\"'images/bottom-hud.png'\"></hud-animation></div><div class=video-feed><hud-element class=video-feed-directive border=\"'images/video-feed.png'\" cover=true label=mainFeed.id content-position=\"'\n" +
    "          width: 92%;\n" +
    "          height: 92%;\n" +
    "          top: 4%;\n" +
    "          left: 4%;\n" +
    "        '\"><img ng-src={{mainFeed.imageData}}></hud-element></div></div></div>"
  );


  $templateCache.put('app/directives/hud-animation/hud-animation.template.html',
    "<div class=hud-animation><img ng-src={{src}} apng></div>"
  );


  $templateCache.put('app/directives/hud-element/hud-element.template.html',
    "<div class=hud-element><img class=hud-element-border ng-src={{border}} style=\"z-index: {{cover ? 2 : 0}}\" apng><div class=hud-element-directive style={{contentPosition}} ng-transclude></div><span class=hud-element-label ng-if=label>{{label}}</span></div>"
  );


  $templateCache.put('app/initializer/initializer.template.html',
    "<div class=initializer-page><h1>{{config.site}}</h1><p>Loading...</p></div>"
  );

}]);

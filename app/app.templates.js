angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/dashboard/dashboard.template.html',
    "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p></div><div class=home-page-content><div class=body-suit><hud-element class=body-suit-directive border=\"'images/borders/suit.svg'\" content-position=\"'\n" +
    "        width: 60%;\n" +
    "        height: 75%;\n" +
    "        top: 14%;\n" +
    "        left: 18%;\n" +
    "      '\"><body-suit></body-suit></hud-element><hud-animation class=body-suit-animation src=\"'images/bottom-hud.svg'\"></hud-animation></div><div class=video-feed><hud-element class=video-feed-directive border=\"'images/borders/video.svg'\" cover><video-feed></video-feed></hud-element><hud-animation class=video-feed-animation src=\"'images/right-hud.png'\"></hud-animation><hud-element class=video-feed-thumbnails border=\"'images/borders/thumbnails.svg'\" content-position=\"'\n" +
    "        width: 85%;\n" +
    "        height: 50%;\n" +
    "        top: 20%;\n" +
    "        left: 1%;\n" +
    "      '\">@TODO: Thumbnails</hud-element></div></div></div>"
  );


  $templateCache.put('app/directives/hud-animation/hud-animation.template.html',
    "<div class=hud-animation><img src={{src}}></div>"
  );


  $templateCache.put('app/directives/hud-element/hud-element.template.html',
    "<div class=hud-element><div class=hud-element-border style=\"background-image: url({{border}}); z-index: {{cover ? 2 : 0}}\"></div><div class=hud-element-directive style={{contentPosition}} ng-transclude></div></div>"
  );


  $templateCache.put('app/initializer/initializer.template.html',
    "<div class=intializer-page><h1>{{config.site}}</h1></div>"
  );

}]);

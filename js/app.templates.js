angular.module("app").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("app/dashboard/dashboard.template.html", "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p></div><div class=home-page-content><div class=body-suit><hud-element class=body-suit-directive><body-suit>@TODO: Body Suit Directive</body-suit></hud-element><hud-animation class=body-suit-animation>@TODO: Animation Directive</hud-animation></div><div class=video-feed><hud-element class=video-feed-directive><video-feed>@TODO: Video Feed Directive</video-feed></hud-element><hud-animation class=video-feed-animation>@TODO: Animation Directive</hud-animation><hud-element class=video-feed-thumbnails>@TODO: Thumbnail Directive</hud-element></div></div></div>");
    $templateCache.put("app/directives/hud-element.template.html", "<div class=hud-element><div class=hud-element-border></div><div class=hud-element-directive ng-transclude></div></div>");
    $templateCache.put("app/initializer/initializer.template.html", "<div class=intializer-page><h1>{{config.site}}</h1></div>");
} ]);
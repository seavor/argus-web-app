angular.module("app").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("app/dashboard/dashboard.template.html", "<div class=home-page><div class=home-page-header><a id=siteID ui-sref=dashboard>the argus project</a> <span class=home-page-header-byline>THE WHOLE WORLD IS WATCHING</span><p class=home-page-header-tagline>Counter-surveillance Armor for the Citizen Body</p></div></div>");
    $templateCache.put("app/initializer/initializer.template.html", "<div class=intializer-page><h1>{{config.site}}</h1></div>");
} ]);
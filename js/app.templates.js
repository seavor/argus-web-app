angular.module("app").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("app/dashboard/dashboard.template.html", "<div class=home-page><div class=hero><h1>{{config.site}}</h1></div></div>");
    $templateCache.put("app/initializer/initializer.template.html", "<div class=intializer-page><div class=hero><h1 class=rotater>{{config.site}}</h1></div></div>");
} ]);
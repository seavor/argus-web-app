angular.module("app").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("app/home/home.template.html", "<div class=home-page><h1>{{config.site}}</h1></div>");
} ]);
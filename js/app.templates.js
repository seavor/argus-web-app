angular.module("app").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("app/footer/footer.template.html", "<h1>Footer</h1>");
    $templateCache.put("app/header/header.template.html", "<h1>Header</h1>");
    $templateCache.put("app/home/home.template.html", "<div class=home-page><h1>Welcome</h1></div>");
} ]);
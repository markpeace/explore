angular.element(document).ready(function() {
  angular.bootstrap(document, ["explore"]);
});

var explore = angular.module('explore', ['ionic'])

//angular.module('Controllers', ['Models']);
angular.module('Models', ['wrapParse']); // At this point Parse is already integrated with Angular's lifecycle.
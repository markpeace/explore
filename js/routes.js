app.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
                .state('ui', {
                url: "/ui",
                abstract: true,
                templateUrl: "pages/ui.html"
        })
                .state('ui.clues', {
                url: "/clues",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/clues.html",
                                controller: "Clues"
                        }
                }
        })
                .state('ui.badges', {
                url: "/badges",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/badges.html",
                        }
                }
        })

        $urlRouterProvider.otherwise("/ui/clues");
})
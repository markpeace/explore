app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.maxCache(0);

        $stateProvider.state('ui', {
                url: "/ui",
                abstract: true,
                templateUrl: "pages/ui.html"
        })

        $stateProvider.state('addLocation', {
                url: "/location/add",
                templateUrl: "pages/addLocation.html",
                controller:"AddLocation"

        })

        $stateProvider.state('ui.clues', {
                url: "/locations",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/locations.html",
                                controller: "Locations"
                        }
                }
        })

        $stateProvider.state('locationDetail', {
                url: "/location/:id",                   
                templateUrl: "pages/locationdetail.html",
                controller: "LocationDetail"
        })

        $stateProvider.state('editLocation', {
                url: "/location/:id/edit",
                templateUrl: "pages/addLocation.html",
                controller:"AddLocation"

        })        

        $stateProvider.state('ui.groups', {
                url: "/groups",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/groups.html",
                                controller: 'Groups'
                        }
                }
        })

        $urlRouterProvider.otherwise("/ui/locations");
})
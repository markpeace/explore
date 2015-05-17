app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.maxCache(0);

        $stateProvider.state('ui', {
                url: "/ui",
                abstract: true,
                templateUrl: "pages/ui.html"
        })

        $stateProvider.state('addLocation', {
                url: "/location/add",
                templateUrl: "pages/location/addLocation.html",
                controller:"AddLocation"

        })

        $stateProvider.state('ui.clues', {
                url: "/locations",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/location/listLocations.html",
                                controller: "ListLocations"
                        }
                }
        })

        $stateProvider.state('locationDetail', {
                url: "/location/:id",                   
                templateUrl: "pages/location/showLocation.html",
                controller: "ShowLocation"
        })

        $stateProvider.state('editLocation', {
                url: "/location/:id/edit",
                templateUrl: "pages/location/addLocation.html",
                controller:"AddLocation"

        })        

        $stateProvider.state('ui.groups', {
                url: "/groups",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/groups/listGroups.html",
                                controller: 'ListGroups'
                        }
                }
        })

        $urlRouterProvider.otherwise("/ui/locations");
})
app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.views.maxCache(0);

        $stateProvider.state('ui', {
                url: "/ui",
                abstract: true,
                templateUrl: "pages/ui.html"
        })


        //GENERIC STUBBS
        var stubbs=['Group', 'Location', 'League']
        stubbs.forEach(function(resource){

                $stateProvider.state('ui.'+resource+"s", {
                        url: "/"+resource.toLowerCase()+"s",
                        views: {
                                'mainContent' :{
                                        templateUrl: "pages/"+resource.toLowerCase()+"/list"+ resource +"s.html",
                                        controller: 'List'+ resource +"s"
                                }
                        }
                })

                $stateProvider.state('add'+resource, {
                        url: "/"+resource.toLowerCase()+"/add",
                        templateUrl: "pages/"+resource.toLowerCase()+"/edit"+ resource +".html",
                        controller: 'Edit'+ resource
                })

                $stateProvider.state('edit'+resource, {
                        url: "/"+resource.toLowerCase()+"/:id/edit",
                        templateUrl: "pages/"+resource.toLowerCase()+"/edit"+ resource +".html",
                        controller: 'Edit'+ resource
                })

                $stateProvider.state('show'+resource, {
                        url: "/"+resource.toLowerCase()+"/:id",
                        templateUrl: "pages/"+resource.toLowerCase()+"/show"+ resource +".html",
                        controller: 'Show'+ resource
                })


        })   


        //NON GENERIC STUBBS
        $stateProvider.state('splash', {
                url: "/splash",
                templateUrl: "pages/splash.html",
                controller: "Splash"
        })
        
        $stateProvider.state("ui.Settings", {
                url: "/admin/settings",
                views: {
                        'mainContent' :{
                                templateUrl: "pages/admin/settings.html",
                                controller: "Settings"
                        }
                }
        })

        $stateProvider.state('isOffline', {
                url: "/isOffline",
                templateUrl: "pages/isOffline.html"
        })



        $urlRouterProvider.otherwise("/splash");
})

//HANDLE ONLINE OFFLINE
app.run(function ($state) {

        if(typeof cordova === 'object') {

                document.addEventListener("offline", function () {
                        console.log("gone offline")
                        var previousState = $state.current.name
                        $state.go("isOffline")

                        document.addEventListener("online", function () {
                                $state.go(previousState)
                        },true)

                }, false);
        }


})
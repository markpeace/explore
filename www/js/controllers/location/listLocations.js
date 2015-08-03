app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = [];          
        $scope.geocount = 0;    
        $scope.accuracy = null;
        $scope.securityLevel = 9999
        $scope.now = Date.now()
        $scope.geolocator = GeoLocator        

        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location.all()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

        $scope.$watch("geolocator.currentCoordinates()",function(e) {
                if(typeof e.timestamp!="undefined") {
                        $scope.geoerror=null;
                        $scope.geocount = $scope.geocount+1
                        $scope.accuracy = e.coords.accuracy
                        $scope.locations.forEach(function(l) {l.updateDistance(e.coords)})                        
                }
        })

        GeoLocator.ErrorFunction(function(e){
                console.log("geolocation error:" +e.message)
                $scope.geoerror=e.message
        })

});
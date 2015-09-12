app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = [];          
        $scope.geocount = 0;    
        $scope.accuracy = null;
        $scope.securityLevel = 9999

        $scope.filters = [
                { label: "Nearby", min:0, max:500 },
                { label: "Walkable", min:500, max:1000 },
                { label: "Distant", min: 1000, max:99999 },
        ]

        $scope.filter=$scope.filters[0]
        $scope.changeFilter = function(f) { 
                $scope.filter=f
        }
        $scope.distanceFilter = function(location) {
                return location.distance>$scope.filter.min && location.distance<$scope.filter.max
        }
        
        var fetchData = function () {
                
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location.all()
                
                if(e=GeoLocator.currentCoordinates().coords) { $scope.locations.forEach(function(l) { l.updateDistance(e) })   }
        
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

        GeoLocator.update(function(e) {
                $scope.geoerror=null;
                $scope.geocount = $scope.geocount+1
                $scope.accuracy = e.coords.accuracy
                $scope.locations.forEach(function(l) {l.updateDistance(e.coords)})               
        })               

        GeoLocator.ErrorFunction(function(e){
                console.log("geolocation error:" +e.message)
                $scope.geoerror=e.message
        })
     
 
});
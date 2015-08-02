app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = [];          
        $scope.geocount = 0;    
        $scope.securityLevel = 9999
        $scope.now = Date.now()
        
        setInterval(function() {$scope.now = Date.now() }, 1000)
        
        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location.all()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();
               
        GeoLocator.go({
                scope:$scope,
                error: function (e) {
                        console.log("geolocation error:" +e.message)
                        $scope.geoerror=e.message
                },
                success: function(e) {
                        $scope.geoerror=null;
                        $scope.geocount = $scope.geocount+1
                        $scope.locations.forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
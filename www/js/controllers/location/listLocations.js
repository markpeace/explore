app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = [];          
        $scope.locationIndicator = "*";    
        $scope.securityLevel = 9999
        $scope.now = Date.now()
        
        setInterval(function() {$scope.now = Date.now() }, 1000)
        
        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();
               
        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                        $scope.timestamp=e.timestamp
                }
        });
});
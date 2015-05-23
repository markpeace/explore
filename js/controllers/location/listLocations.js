app.controller('ListLocations', function($scope, DataService, GeoLocator) { 
        $scope.locations = DataService.location;          
        $scope.locationIndicator = "*";    
        $scope.securityLevel = DataService.user.all()[0].securityLevel()
        
        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
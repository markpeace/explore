app.controller('ListLocations', function($scope, DataService, GeoLocator) { 
        $scope.locations = DataService.location;          
        $scope.locationIndicator = "*";       
        
        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
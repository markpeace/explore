app.controller('Locations', function($scope, DataService, GeoLocator) { 
        $scope.locations = DataService.locations;          
        $scope.locationIndicator = "*";

        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = DataService.location;          
        $scope.locationIndicator = "*";    

        $scope.securityLevel = 9999

        $scope.$on('DataService:DataLoaded', function() {
                console.log("m")
                $scope.securityLevel = DataService.user.securityLevel()
        })        

        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
app.controller('ListLocations', function($scope, DataService, GeoLocator) { 
        $scope.locations = DataService.location;          
        $scope.locationIndicator = "*";    

        $scope.securityLevel = 9999

        if (DataService.user.all()[0]) {
                $scope.securityLevel = DataService.user.all()[0].securityLevel()                

        } else {
                window.setTimeout(function() {
                        $scope.securityLevel = DataService.user.all()[0].securityLevel()                

                },5000)                
        }


        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
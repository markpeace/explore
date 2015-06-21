app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = DataService.location;          
        $scope.locationIndicator = "*";    
        $scope.securityLevel = 9999
        
        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();
               
        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.locations.all().forEach(function(l) {l.updateDistance(e.coords)})
                }
        });
});
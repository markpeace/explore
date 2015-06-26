app.controller('ListLocations', function($scope, $q, DataService, GeoLocator) { 
        $scope.locations = [];          
        $scope.locationIndicator = "*";    
        $scope.securityLevel = 9999
        
        var fetchData = function () {
                console.log("M")
                $scope.securityLevel = DataService.user.data[0].securityLevel()
                $scope.locations = DataService.location
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
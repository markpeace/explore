app.controller('LocationDetail', function($scope, DataService, $stateParams, GeoLocator) { 
        console.info("Navigated to Clue Details for " + $stateParams.id)
        $scope.location = DataService.locations[$stateParams.id];
        $scope.locationIndicator = "*";
        
        $scope.checkinIcons = {
                "GPS" : "ion-location",
                "QR" : "ion-qr-scanner",
                "SELF" : "ion-person",
        }

        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.location.updateDistance(e.coords)
                }
        });

});
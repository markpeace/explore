app.controller('ShowLocation', function($scope, DataService, $stateParams, GeoLocator) { 
        console.info("Navigated to Clue Details for " + $stateParams.id)        
        $scope.location = DataService.location.filterBy({id: $stateParams.id})[0];
        $scope.locationIndicator = "*";
        $scope.securityLevel = DataService.user.all()[0].securityLevel()
        
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
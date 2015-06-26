app.controller('ShowLocation', function($scope, DataService, $stateParams, GeoLocator) { 

        console.info("Navigated to Clue Details for " + $stateParams.id)        
        $scope.checkinIcons = {
                "GPS" : "ion-location",
                "QR" : "ion-qr-scanner",
                "SELF" : "ion-person",
        }

        var fetchData = function () {
                $scope.location = DataService.location.filterBy({id: $stateParams.id})[0];
                $scope.locationIndicator = "*";
                $scope.securityLevel = DataService.user.securityLevel()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();



        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.location.updateDistance(e.coords)
                }
        });

});
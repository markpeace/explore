app.controller('LocationDetail', function($scope, DataService, $stateParams) { 
        console.info("Navigated to Clue Details for " + $stateParams.id)
        $scope.location = DataService.locations[$stateParams.id];
        navigator.geolocation.watchPosition(function(e) { $scope.location.updateDistance(e.coords) }, function() {}, { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true })
        
        $scope.checkinIcons = {
                "Checkin" : "ion-location",
                "QR Code" : "ion-qr-scanner",
                "Selfie" : "ion-person",
        }
        
});
app.controller('ClueDetail', function($scope, DataService, $stateParams) { 
        console.info("Navigated to Clue Details for " + $stateParams.id)
        $scope.clue = DataService.clues[$stateParams.id];
        $scope.clue.distance=1
        
        $scope.checkinIcons = {
                "Checkin" : "ion-location",
                "QR Code" : "ion-qr-scanner",
                "Selfie" : "ion-person",
        }
        
});
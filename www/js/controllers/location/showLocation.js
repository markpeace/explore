app.controller('ShowLocation', function($scope, $ionicLoading, DataService, $stateParams, GeoLocator) { 

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


        $scope.checkIn = function(type) {
                console.log("checkin")               
                switch(type) {
                        case "GPS":   

                                if($scope.location.found()) return;

                                $ionicLoading.show({
                                        template: 'Checking In...'
                                });

                                checkin = DataService.checkin.new({
                                        user: DataService.user,
                                        location: $scope.location                                        
                                })

                                checkin.save().then(function() {
                                        $ionicLoading.show({
                                                template: 'Congratulations, you have <br/> checked into this location!'
                                        });
                                        
                                        setInterval(function() { $ionicLoading.hide() }, 2000)
                                        
                                })
                }

        }


        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.location.updateDistance(e.coords)
                        $scope.$apply();
                }
        });

});
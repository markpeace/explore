app.controller('AddLocation', function($scope, $ionicPopup, $state, $stateParams, DataService, GeoLocator) { 
        console.info("adding/editing a location");

        if($stateParams.id) {
                $scope.location = DataService.location.filterBy({id:$stateParams.id})[0]
        }else{
                $scope.location = DataService.location.new({ type: 'GPS' });                        
        }

        $scope.types = ['GPS', 'QR Code', 'Selfie']       

        $scope.geolocationColor = 'red'


        $scope.takePhoto = function() {
                navigator.camera.getPicture(function() {}, function() {}, {} );
        }

        $scope.save = function() {
                $scope.location.save().then(function() {
                        $state.go("ui.clues");
                });
        }


        $scope.delete = function() {
                var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Location',
                        template: 'Are you sure you want to delete this location?'
                });
                confirmPopup.then(function(res) {
                        if(res) {
                                $scope.location.delete().then(function() {
                                        $state.go("ui.clues");
                                });
                        }
                });
        }

        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.location.geolocation = e.coords
                        if (e.coords.accuracy>30) {
                                $scope.geolocationColor = 'red'
                        } else if (e.coords.accuracy>15) {
                                $scope.geolocationColor = 'orange'
                        } else {
                                $scope.geolocationColor = 'green'
                        }                        
                }
        })

});
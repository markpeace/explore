app.controller('AddLocation', function($scope, $state, $stateParams, DataService, GeoLocator) { 
        console.info("adding/editing a location");

        if($stateParams.id) {
                $scope.location = DataService.location.filterBy({id:$stateParams.id})[0]
        }else{
                $scope.location = DataService.location.new({ type: 'GPS' });                        
        }
        
        $scope.types = ['GPS', 'QR Code', 'Selfie']       

        $scope.geolocationColor = 'red'

        $scope.save = function() {
                $scope.location.save().then(function() {
                        $state.go("ui.clues");
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
app.controller('AddLocation', function($scope, $state, DataService, GeoLocator) { 
        console.info("adding a location");
                           
        $scope.location = DataService.location.new({ type: 'GPS' });               
        
        $scope.types = ['GPS', 'QR Code', 'Selfie']       
        
        $scope.geolocationColor = 'red'
        
        $scope.save = function() {
                console.log($scope.location)
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
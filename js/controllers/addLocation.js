app.controller('AddLocation', function($scope, DataService, GeoLocator) { 
        console.info("adding a location");
        
        
                
        $scope.location = {
                type: 'GPS',
                photo: ''
        }
        
        $scope.types = ['GPS', 'QR Code', 'Selfie']       
        
        $scope.geolocationColor = 'red'
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
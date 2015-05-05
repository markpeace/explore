app.controller('Locations', function($scope, DataService) { 
        $scope.locations = DataService.locations;          
        $scope.geoloc = {}
        
        navigator.geolocation.watchPosition(function(e) { $scope.geoloc = e }, function() {}, { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true })               
        
        //DataService.updateDistances()
        
});
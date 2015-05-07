app.controller('Locations', function($scope, DataService) { 
        $scope.locations = DataService.locations;          
        $scope.geoloc = {}

        navigator.geolocation.watchPosition(
                function(e) { $scope.geoloc = e.coords; $scope.locations.forEach(function(l) {l.updateDistance(e.coords)}) }, 
                function(e) { alert(e);}, 
                { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true })                      

});
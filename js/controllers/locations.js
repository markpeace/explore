app.controller('Locations', function($scope, DataService) { 
        $scope.locations = DataService.locations;          
        $scope.geoloc = {}

        document.addEventListener("deviceready", function() {
                navigator.geolocation.watchPosition(
                        function(e) { $scope.geoloc = e.coords; $scope.locations.forEach(function(l) {l.updateDistance(e.coords)}) }, 
                        function(e) {}, 
                        { maximumAge: 10000, timeout: 10000, enableHighAccuracy: true })         
        }, false);



});
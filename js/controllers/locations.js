app.controller('Locations', function($scope, DataService) { 
        $scope.locations = DataService.locations;          
        $scope.geoloc = {}
        $scope.locationIndicator = "*";


        geoWatch = navigator.geolocation.watchPosition(
                function(e) { $scope.locationIndicator = ""; $scope.locations.forEach(function(l) {l.updateDistance(e.coords)}) }, 
                function(e) {}, 
                { maximumAge: 10000, timeout: 10000, enableHighAccuracy: true })         

        $scope.$on('$stateChangeStart', function() {
                navigator.geolocation.clearWatch(geoWatch)
        })   

});
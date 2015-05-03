app.controller('Locations', function($scope, DataService) { 
        $scope.locations = DataService.locations;
});
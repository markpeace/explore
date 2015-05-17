app.controller('ShowGroup', function($scope, DataService, $stateParams, GeoLocator) { 
        console.info("Navigated to Group Details for " + $stateParams.id)        
        $scope.group = DataService.group.filterBy({id: $stateParams.id})[0];        
});
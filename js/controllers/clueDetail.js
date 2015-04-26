app.controller('ClueDetail', function($scope, DataService, $stateParams) { 
        console.info("Navigated to Clue Details for " + $stateParams.id)
        $scope.clue = DataService.clues[$stateParams.id];
});
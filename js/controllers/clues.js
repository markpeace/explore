app.controller('Clues', function($scope, DataService) { 
        $scope.clues = DataService.clues;
});
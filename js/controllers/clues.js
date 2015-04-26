app.controller('Clues', function($scope, $ionicSideMenuDelegate, DataService) { 
        //      $ionicSideMenuDelegate.toggleRight(); 
        $scope.clues = DataService.clues;
});
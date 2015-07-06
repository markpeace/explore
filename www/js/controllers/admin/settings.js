app.controller('Settings', function($scope, DataService) {
        $scope.rebuild_database = DataService.rebuildAll;        
});
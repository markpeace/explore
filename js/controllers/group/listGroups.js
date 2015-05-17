app.controller('ListGroups', function($scope, DataService, GeoLocator) { 
       
        console.info("groups view")
        
        $scope.groups = DataService.group.all()
       
});
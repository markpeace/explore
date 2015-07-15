app.controller('ShowLeague', function($scope, $q, $state, $stateParams, DataService) { 
                
        var fetchData = function () {
                $scope.league=DataService.league.filterBy({id: $stateParams.id})[0]                
                $scope.groups = $scope.league.groups.data
                $scope.groups.forEach(function(group) { group.fetch() })
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

});
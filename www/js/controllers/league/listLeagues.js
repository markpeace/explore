app.controller('ListLeagues', function($scope, $state, $stateParams, DataService) { 

        $scope.leagues=[]

        var fetchData = function () {
                DataService.user.groups.data.forEach(function(group) {                        
                        group.leagues.data.forEach(function(league) {                                
                                if (!$scope.leagues.indexOf(league)) $scope.leagues.push(league);
                        })
                })
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

});
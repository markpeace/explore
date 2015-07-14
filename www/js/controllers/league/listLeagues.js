app.controller('ListLeagues', function($scope, $state, $stateParams, DataService) { 
        var fetchData = function () {
                //STUFF HERE
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

});
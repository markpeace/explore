app.controller('ShowGroup', function($scope, DataService, $stateParams, GeoLocator, $window) { 
        console.info("Navigated to Group Details for " + $stateParams.id)        

        $scope.width= $window.innerWidth<$window.innerHeight ? $window.innerWidth : $window.innerHeight * .9
        $scope.width = $scope.width *.9

        var fetchData = function () {
                $scope.group = DataService.group.filterBy({id: $stateParams.id})[0];        
                $scope.securityLevel = DataService.user.securityLevel()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


});
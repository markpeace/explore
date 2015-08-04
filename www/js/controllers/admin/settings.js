app.controller('Settings', function($scope, $ionicDeploy, DataService) {

        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.rebuild_database = DataService.rebuildAll;      
                $scope.parse = Parse
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();

        $scope.toggleDatabase=function() {
                Parse.usingTestServer = !Parse.usingTestServer
                DataService.initialise();
                DataService.rebuildAll();
        }
        
});
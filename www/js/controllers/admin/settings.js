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

        // Update app code with new release from Ionic Deploy

        alert("doing update")
        
        try {
                $ionicDeploy.update().then(function(res) {
                        console.log('Ionic Deploy: Update Success! ', res);
                }, function(err) {
                        console.log('Ionic Deploy: Update error! ', err);
                }, function(prog) {
                        console.log('Ionic Deploy: Progress... ', prog);
                });
        } catch (ex) {
                alert(ex)
        }

});
app.controller('Splash', function($scope, $state, $ionicSideMenuDelegate, DataService) { 

        var fetchData = function () {
             
                if(DataService.user.groups.data.length>0) {
                        $state.go('ui.Locations');
                }   

                $scope.joinGroup = function() { 

                        try {
                                DataService.user.joinGroup().then(function() {
                                        $state.go('ui.Locations');
                                })
                        } catch(ex) {
                                alert(ex.message)
                        }
                }

        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


});
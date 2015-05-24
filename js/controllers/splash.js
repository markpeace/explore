app.controller('Splash', function($scope, $state, $ionicSideMenuDelegate, DataService) { 
        $scope.DataService = DataService

        $scope.updateComplete = DataService

        $scope.$watch('updateComplete.isComplete', function(oldval,newval) {
                if (DataService.isComplete) {
                        window.setTimeout(function() {
                                if(DataService.user.all()[0].groups.all().length>0) {
                                        $state.go('ui.Locations');
                                }                       
                        },300)
                }
        })

        $scope.joinGroup = function() {
                DataService.user.all()[0].joinGroup().then(function() {
                        $state.go('ui.Locations');
                })
        }
});
app.controller('Splash', function($scope, $ionicSideMenuDelegate, DataService) { 
        $scope.DataService = DataService

        $scope.updateComplete = DataService

        $scope.$watch('updateComplete.isComplete', function(oldval,newval) {
                if (DataService.isComplete) {
                        window.setTimeout(function() {
                                if(DataService.user.all()[0].groups.all().length>0) {
                                        console.log("is part of a group")
                                }                       
                        },300)
                }
        })
});
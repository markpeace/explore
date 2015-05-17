app.controller('EditGroup', function($scope, $ionicModal, $ionicPopover, $state, $stateParams, DataService, GeoLocator) { 
        console.info("adding/editing a group");

        if($stateParams.id) {
                $scope.group = DataService.group.filterBy({id:$stateParams.id})[0]
        } else {
                $scope.group = DataService.group.new();   
        }
        
        $scope.save = function() {
                $scope.group.save().then(function() {
                        $state.go("ui.Groups");
                }, function (e) {
                        alert(e)
                });
        }


        $scope.delete = function() {
                var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Group',
                        template: 'Are you sure you want to delete this group (all memberships will also be deleted)?'
                });
                confirmPopup.then(function(res) {
                        if(res) {
                                $scope.group.delete().then(function() {
                                        $state.go("ui.Groups");
                                });
                        }
                });
        }
      
});
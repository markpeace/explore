app.controller('ListGroups', function($scope, $q, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.selectedFilter = "Joined" 
        $scope.groups = []

        $scope.selectFilter = function(filter) {

                $scope.selectedFilter=filter || "Joined";

                if($scope.selectedFilter=="Joined") {
                        $scope.groups = DataService.user.groups.data
                } else {
                        $scope.groups=DataService.group.all()
                }

        }               

        $scope.joinGroup = function() {

                DataService.user.joinGroup().then(function() {
                        $scope.securityLevel = DataService.user.securityLevel()    
                });
                
        };


        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location
                $scope.selectFilter()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();




});
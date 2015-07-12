app.controller('EditGroup', function($scope, $q, $ionicPopup, $ionicModal, $state, $stateParams, DataService, GeoLocator) { 
        console.info("adding/editing a group");

        $scope.save = function() {

                //Remove any leagues already attached
                $scope.group.leagues.data.forEach(function(league) {

                        console.log(league)

                        $scope.group.leagues.remove(league)
                })

                //Add leagues
                $scope.selectedLeagues.forEach(function(league_id) {
                        $scope.group.leagues.add(DataService.league.filterBy({id:league_id})[0]);
                })

                var promises = [$scope.group.save()]
                var leaguestosave=[]

                initialLeagues.forEach(function(league) {
                        DataService.league.filterBy({id:league})[0].groups.remove($scope.group)
                        leaguestosave.push(league)
                })

                $scope.selectedLeagues.forEach(function(league) {
                        DataService.league.filterBy({id:league})[0].groups.add($scope.group)
                        leaguestosave.push(league)
                })                

                leaguestosave.forEach(function(league) {
                        promises.push(DataService.league.filterBy({id:league})[0].save())
                })

                $q.all(promises).then(function() {
                        $state.go("ui.Groups");
                })
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

        $ionicModal.fromTemplateUrl('league-popover.html', {
                scope: $scope,
                animation: 'slide-in-up'
        }).then(function(popover) {
                $scope.leagueChooser = popover;
        });


        $scope.selectedLeagues = []
        $scope.chooseLeague = function(league) {

                if($scope.selectedLeagues.indexOf(league.id)>-1) {
                        $scope.selectedLeagues.splice($scope.selectedLeagues.indexOf(league.id),1) 
                } else {
                        $scope.selectedLeagues.push(league.id)  
                }               
        }

        var initialLeagues=[]
        var fetchData = function () {

                $scope.leagues = DataService.league

                if($stateParams.id) {
                        $scope.group = DataService.group.filterBy({id:$stateParams.id})[0]

                        $scope.group.leagues.data.forEach(function(league) {
                                $scope.selectedLeagues.push(league.id)
                                initialLeagues.push(league.id)
                        })


                } else {
                        $scope.group = DataService.group.new({securityLevel:9999});   
                }
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


});
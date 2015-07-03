app.controller('Splash', function($scope, $state, $ionicSideMenuDelegate, DataService) { 

        var fetchData = function () {
                             
/*                                              UNCOMMENT THIS TO FORCE THE SYSTEM TO ADD USER TO SUPERUSERS
                u=DataService.user
                g=DataService.group.data[0]
                
                g.users.add(u)
                u.groups.add(g)
                
                g.save()
                u.save()
                console.log("added")*/
                
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

        $scope.data=DataService
        
        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


});
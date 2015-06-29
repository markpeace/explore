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

                var deferred = $q.defer()

                if(typeof cordova=="undefined") {
                        alert("Sorry, you can only do this using the QR Reader of a mobile device");
                        deferred.resolve()
                        return deferred.promise;
                }

                var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                scanner.scan(function (result) {


                        group = DataService.group.filterBy({id:result.text})[0]
                        user = DataService.user
                        
                        user.groups.add(group)
                        group.users.add(user)
                        
                        $q.all([user.save(), group.save()]).then(function() {
                                group.users.add(user).then(function () {

                                        if(group.securityLevel<user._securityLevel) {
                                                user.securityLevel(group.securityLevel)
                                        }

                                        $scope.$apply()

                                        deferred.resolve();

                                });                          
                        })       

                })

                return deferred.promise


        };


        var fetchData = function () {
                $scope.securityLevel = DataService.user.securityLevel()
                $scope.locations = DataService.location
                $scope.selectFilter()
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();




});
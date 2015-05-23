app.controller('ListGroups', function($scope, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.selectedFilter = "Joined" 
        $scope.groups = []

        $scope.selectFilter = function(filter) {
                $scope.selectedFilter=filter || "Joined";

                if($scope.selectedFilter=="Joined") {
                        $scope.groups = DataService.user.all()[0].groups.all()
                } else {
                        $scope.groups=DataService.group.all()
                }

        }

        $scope.joinGroup = function() {


                   


                try {

                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                        scanner.scan(function (result) {
                                                                
                                user = DataService.user.all()[0];
                                group = DataService.group.filterBy({id:result.text})[0]
                                
                                user.groups.add(group).then(function() {
                                         group.users.add(user).then(function () {

                                         });                          
                                })                              
                        })

                } catch (ex) {
                        alert(ex)
                }
        };


        if(DataService.user.all()[0]) {
                $scope.selectFilter() 
                $scope.securityLevel = models.user.all()[0].securityLevel()

        } else {

                window.setTimeout(function() {
                        $scope.selectFilter()    
                        $scope.securityLevel = DataService.user.all()[0].securityLevel()
                        $scope.$apply();
                },4000)


        }




});
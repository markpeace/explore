app.controller('ListGroups', function($scope, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.groups = DataService.group.all()
        
      W

        $scope.joinGroup = function() {
                
                group = DataService.group.all()[0];                
                user = DataService.user.all()[0];
                
                user.groups.add(group);
                group.users.add(user);
                
                
                

/*
                try {

                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                        scanner.scan(function (result) {

                                (new Parse.Query(""))

                        })

                } catch (ex) {
                        console.log(ex)
                }*/
        };




});
app.controller('ListGroups', function($scope, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.groups = DataService.group.all()

        $scope.joinGroup = function() {

                group = DataService.group.all()[0];                
                user = DataService.user.all()[0];

                user.groups.add(group).then(function() {
                        console.log("doneuser ");
                })
                group.users.add(user).then(function() {
                        console.log("done groups");
                });




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
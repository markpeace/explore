app.controller('ListGroups', function($scope, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.groups = DataService.group.all()

        $scope.joinGroup = function() {

                group = DataService.group.all()[0];                
                user = DataService.user.all()[0];

                user.groups.all()[0].remove().then(function() {
                        console.log("done")
                        console.log(user.groups.all())

                })


                //user.groups.add(group).then()
                //group.users.add(user).then();             


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
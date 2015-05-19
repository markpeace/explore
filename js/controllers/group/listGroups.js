app.controller('ListGroups', function($scope, DataService, GeoLocator) { 

        console.info("groups view")

        $scope.groups = DataService.group.all()

        $scope.joinGroup = function() {
                try {

                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                        scanner.scan(function (result) {
                                alert(result)
                        })

                } catch (ex) {
                        console.log(ex)
                }
        }

});
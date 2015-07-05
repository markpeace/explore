app.controller('ShowLocation', function($scope, $ionicLoading, DataService, $stateParams, $window, GeoLocator) { 

        console.info("Navigated to Clue Details for " + $stateParams.id)        

        var fetchData = function () {
                $scope.location = DataService.location.filterBy({id: $stateParams.id})[0];
                $scope.locationIndicator = "*";
                $scope.securityLevel = DataService.user.securityLevel()    
                $scope.checkin_data = DataService.checkin.filterBy   ({ location: $scope.location })[0]

        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


        $scope.width= $window.innerWidth<$window.innerHeight ? $window.innerWidth : $window.innerHeight * .9
        $scope.width = $scope.width *.9

        $scope.checkIn = function(type) {

                var photo = null;

                var doCheckin = function() {
                        if($scope.location.found()) return;

                        $ionicLoading.show({
                                template: 'Checking In...'
                        });

                        checkin = DataService.checkin.new({
                                user: DataService.user,
                                location: $scope.location,
                                photo: photo
                        })

                        checkin.save().then(function() {
                                $ionicLoading.show({
                                        template: 'Congratulations, you have <br/> checked into this location!'
                                });

                                setInterval(function() { $ionicLoading.hide() }, 2000)

                        })
                }

                var takePhoto = function() {
                        navigator.camera.getPicture(function(e) {
                                photo=e;
                                doCheckin();
                        }, function() {}, { 
                                quality : 50,
                                destinationType : Camera.DestinationType.DATA_URL,
                                //sourceType : Camera.PictureSourceType.CAMERA,
                                cameraDirection: Camera.Direction.FRONT,
                                allowEdit : true,
                                encodingType: Camera.EncodingType.JPEG,
                                targetWidth: 400,
                                targetHeight: 400,
                                //popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false 
                        });
                }

                var scanQRCode = function () {


                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                        scanner.scan(function (result) {                               

                                if (result.text==$scope.location.id) doCheckin();

                        })


                }

                switch(type) {
                        case "GPS":   
                                doCheckin();
                        case "SELF":
                                takePhoto();
                        case "QR":
                                scanQRCode();
                }

        }


        GeoLocator.go({
                scope:$scope,
                success: function(e) {
                        $scope.locationIndicator = "";
                        $scope.location.updateDistance(e.coords)
                        $scope.$apply();
                }
        });

});
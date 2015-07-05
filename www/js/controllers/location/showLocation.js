app.controller('ShowLocation', function($scope, $ionicLoading, DataService, $stateParams, GeoLocator) { 

        console.info("Navigated to Clue Details for " + $stateParams.id)        

        var fetchData = function () {
                $scope.location = DataService.location.filterBy({id: $stateParams.id})[0];
                $scope.locationIndicator = "*";
                $scope.securityLevel = DataService.user.securityLevel()                
        }

        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();


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
                                allowEdit : true,
                                encodingType: Camera.EncodingType.JPEG,
                                targetWidth: 400,
                                targetHeight: 400,
                                //popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false 
                        });
                }

                switch(type) {
                        case "GPS":   
                                doCheckin();
                        case "SELF":
                                takePhoto();
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
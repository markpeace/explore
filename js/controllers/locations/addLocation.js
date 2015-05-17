app.controller('AddLocation', function($scope, $ionicModal, $ionicPopover, $state, $stateParams, DataService, GeoLocator) { 
        console.info("adding/editing a location");


        $scope.types = ['GPS', 'QR Code', 'Selfie']       

        $scope.geolocationColor = 'red'

        $scope.takePhoto = function() {
                navigator.camera.getPicture(function(e) {
                        $scope.location.image=e
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

        $scope.categories = DataService.category.all();

        $ionicModal.fromTemplateUrl('category-popover.html', {
                scope: $scope,
                animation: 'slide-in-up'
        }).then(function(popover) {
                $scope.categoryChooser = popover;
        });

        $scope.openCategoryChooser = function() { $scope.categoryChooser.show(); }
        $scope.closeCategoryChooser = function() { $scope.categoryChooser.hide(); }




        $scope.save = function() {
                $scope.location.save().then(function() {
                        $state.go("ui.clues");
                }, function (e) {
                        alert(e)
                });
        }


        $scope.delete = function() {
                var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete Location',
                        template: 'Are you sure you want to delete this location?'
                });
                confirmPopup.then(function(res) {
                        if(res) {
                                $scope.location.delete().then(function() {
                                        $state.go("ui.clues");
                                });
                        }
                });
        }

        $scope.triggerGeolocation = function() {
                console.log("looking for geolocation"); 
                GeoLocator.go({
                        scope:$scope,
                        success: function(e) {
                                $scope.location.geolocation = e.coords
                                if (e.coords.accuracy>30) {
                                        $scope.geolocationColor = 'red'
                                } else if (e.coords.accuracy>15) {
                                        $scope.geolocationColor = 'orange'
                                } else {
                                        $scope.geolocationColor = 'green'
                                }                        
                        }
                })
        }


        if($stateParams.id) {
                $scope.location = DataService.location.filterBy({id:$stateParams.id})[0]
        } else {
                $scope.location = DataService.location.new({ type: 'GPS' });   
                $scope.triggerGeolocation();
        }


});
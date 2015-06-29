app.controller('EditLocation', function($scope, $ionicModal, $ionicPopup, $state, $stateParams, $q, DataService, GeoLocator) { 
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


        $ionicModal.fromTemplateUrl('category-popover.html', {
                scope: $scope,
                animation: 'slide-in-up'
        }).then(function(popover) {
                $scope.categoryChooser = popover;
        });

        $scope.openCategoryChooser = function() { $scope.categoryChooser.show(); }
        $scope.closeCategoryChooser = function() { $scope.categoryChooser.hide(); }
        $scope.selectedCategories = []
        $scope.chooseCategory = function(category) {
               
                if($scope.selectedCategories.indexOf(category.id)>-1) {
                       $scope.selectedCategories.splice($scope.selectedCategories.indexOf(category.id),1) 
                } else {
                        
                      $scope.selectedCategories.push(category.id)  
                }               
        }



        $scope.save = function() {
                
                //Remove any categories already attached
                $scope.location.categories.data.forEach(function(category) {
                        $scope.location.categories.remove(category)
                })
                                
                //Add categories
                $scope.selectedCategories.forEach(function(cat_id) {
                        $scope.location.categories.add(DataService.category.filterBy({id:cat_id})[0]);
                })

                $scope.location.save().then(function() {
                        $state.go("ui.Locations");        
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
                                        $state.go("ui.Locations");
                                });
                        }
                });
        }

        $scope.triggerGeolocation = function() {
                console.log("looking for geolocation"); 
                GeoLocator.go({
                        scope:$scope,
                        success: function(e) {

                                $scope.location.geolocation = {}

                                for(v in e.coords) { $scope.location.geolocation[v]=e.coords[v] }

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

        var fetchData = function() {

                $scope.categories = DataService.category;

                if($stateParams.id) {
                        $scope.location = DataService.location.filterBy({id:$stateParams.id})[0]
                        
                        $scope.location.categories.data.forEach(function(category) {
                                $scope.selectedCategories.push(category.id)
                        })
                        
                } else {
                        $scope.location = DataService.location.new({ type: 'GPS' });   
                        $scope.triggerGeolocation();
                }

        }


        $scope.$on('DataService:DataLoaded', fetchData)        
        if(DataService._loadcomplete) fetchData();



});
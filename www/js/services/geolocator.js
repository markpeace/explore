app.service('GeoLocator', function($cordovaGeolocation) {

        locationWatcher = {}

        return {

                go: function (params) {

                        try {
                                var geolocator = cordova.require("cordova/plugin/geolocation");
                                console.log(geolocator)
                        } catch (ex) {
                                alert(ex)
                        }

                        
                        defaults = {
                                maximumAge:0,
                                timeout: 10000,
                                enableHighAccuracy:false,
                                success: function(e) { console.info("geolocation updated:" + e); },
                                error: function(e) { console.log("geolocation error: "+ e.message); }
                        }

                        var params;
                        for (var attrname in defaults) { params[attrname] = params[attrname] || defaults[attrname]; }

                        if (!params.scope) {
                                console.error("you must pass a scope variable to the geolocation watcher");    
                                return;
                        }


                        locationWatcher = $cordovaGeolocation.watchPosition(params);
                        locationWatcher.then(
                                null,
                                params.error,
                                params.success);

                        params.scope.$on('$stateChangeStart', function() {                                
                                locationWatcher.clearWatch();
                        })      


                }}

});

/*
geolocation = {
                g: this,
                active: false,
                attempts:0,
                targetAccuracy:11,
                onSuccess:function(e) {

                        geolocation.attempts++

                        if(e.coords.accuracy<$scope.location.geolocation.accuracy) {  
                                $scope.location.geolocation = e.coords
                                $scope.$apply()
                        }

                        if(e.coords.accuracy<geolocation.targetAccuracy) {                                 
                                navigator.geolocation.clearWatch(geolocation.watch) 
                                geolocation.active=false;
                                $scope.location.geolocation=e.coords
                                $scope.$apply();
                        }

                },
                onError:function() {},
                go: function () {
                        console.log("looking for location")
                        geolocation.watch = navigator.geolocation.watchPosition(geolocation.onSuccess, geolocation.onError, { maximumAge: 3000, maxWait: 10000, enableHighAccuracy: true });
                        geolocation.active=true;
                }
        }
*/
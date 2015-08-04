app.service('GeoLocator', function($q, $rootScope) {

        var locationWatcher = {}      

        var currentCoordinates = {timestamp:0}
        var updateDeferral = $q.defer()

        var successFunction = function () { }
        var _successFunction = function (e) {
                latestError=null
                e.timestamp=Date.now()
                currentCoordinates=e         
                updateDeferral.notify(e)
                successFunction(e)
        }

        var latestError = null;
        var errorFunction = function () { }
        var _errorFunction = function(e) {
                latestError = e
                errorFunction(e)
        }
        var _params = {
                enableHighAccuracy: true,
                maximumAge: 0
        }

        triggerGeolocation = function() {

                navigator.geolocation.getCurrentPosition(function(e) {

                        _successFunction(e)

                        $rootScope.$on( "$stateChangeSuccess", function() {
                                updateDeferral.notify(e)
                        })


                        getLocation = function() {     
                                navigator.geolocation.clearWatch(locationWatcher)
                                locationWatcher = navigator.geolocation.watchPosition(_successFunction, _errorFunction, _params)
                        }
                        getLocation();

                        setInterval(function() {
                                if(Date.now() - currentCoordinates.timestamp > 7500) getLocation();
                        }, 1000)

                }, _errorFunction, _params)

        }

        document.addEventListener("deviceready", triggerGeolocation);

        if (typeof cordova != 'object') {
                triggerGeolocation();             
        }


        return {
                currentCoordinates: function() { return currentCoordinates },
                latestError: function() { return latestError },
                SuccessFunction: function(f) {
                        successFunction=f
                }, 
                ErrorFunction: function(f) {
                        errorFunction=f
                },
                update:function(f) { updateDeferral.promise.then(null, null, f) }
        }

});
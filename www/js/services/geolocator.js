app.service('GeoLocator', function() {

        var locationWatcher = {}      

        var currentCoordinates = {}

        var successFunction = function () { }
        var _successFunction = function (e) {
                latestError=null
                currentCoordinates=e
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
                        setInterval(function() {
                                navigator.geolocation.clearWatch(locationWatcher)
                                locationWatcher = navigator.geolocation.watchPosition(_successFunction, _errorFunction, _params)   
                        }, 5000)
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
                }
        }

});
app.service('GeoLocator', function($cordovaGeolocation) {

        locationWatcher = {}
        
        document.addEventListener("deviceready", function () {
                
                alert("device is ready")
                
        })

        return {

                go: function (params) {

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
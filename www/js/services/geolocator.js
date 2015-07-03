app.service('GeoLocator', function($interval) {

        locationWatcher = {}

        return {
                go: function (params) {
                        
                        defaults = {
                                maximumAge:3000,
                                timeout: 5000,
                                enableHighAccuracy:true,
                                success: function(e) { console.info("geolocation updated:" + e); },
                                error: function(e) { console.warn("geolocation error: "+ e.message) }
                        }

                        for (var attrname in defaults) { params[attrname] = params[attrname] || defaults[attrname]; }

                        if (!params.scope) {
                                console.error("you must pass a scope variable to the geolocation watcher");    
                                return;
                        }
                        
                        locationWatcher = $interval(function() {
                                navigator.geolocation.getCurrentPosition(params.success, params.error, {maximumAge: params.maximumAge, timeout: params.timeout, enableHighAccuracy: params.enableHighAccuracy})
                        }, 3000)

                        params.scope.$on('$stateChangeStart', function() {                                
                                $interval.cancel(locationWatcher);
                        })      

                }}

});
app.service('GeoLocator', function() {

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
                            
                        var locationWatcher = navigator.geolocation.watchPosition(
                                params.success,                                                                                  
                                params.error,
                                {
                                        maximumAge: 1000, 
                                        timeout: 5000, 
                                        enableHighAccuracy: true
                                }
                        )

                        params.scope.$on('$stateChangeStart', function() {                                
                                navigator.geolocation.clearWatch(locationWatcher);
                        })      

                    

                        

                }}

});
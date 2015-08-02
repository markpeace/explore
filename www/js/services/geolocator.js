app.service('GeoLocator', function() {

        locationWatcher = {}

        return {

                go: function (params) {

                        defaults = {
                                maximumAge:0,
                                timeout: 10000,
                                enableHighAccuracy:true,
                                success: function(e) { console.info("geolocation updated:" + e); },
                                error: function(e) { console.log("geolocation error: "+ e.message); alert("geolocation error: "+ e.message) }
                        }

                        var params;
                        for (var attrname in defaults) { params[attrname] = params[attrname] || defaults[attrname]; }

                        if (!params.scope) {
                                console.error("you must pass a scope variable to the geolocation watcher");    
                                return;
                        }


                        var repoll = function () {
                                setInterval(function() {
                                        navigator.geolocation.getCurrentPosition(params.success, params.error, params)
                                }, 5000)
                        }

                        locationWatcher = navigator.geolocation.getCurrentPosition(repoll, null, params)
                        
                        params.scope.$on('$stateChangeStart', function() {                                
                                clearInterval(locationWatcher);
                        })      

                }}

});
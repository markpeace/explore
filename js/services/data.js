app.service('DataService', function($q) {

        var app_id = "uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz";
        var js_key = "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N";
        Parse.initialize(app_id, js_key);

        
        //DEFINE MODEL MAKER
        Model = function (options) {
                //private attributes   
                var root=this             
                var data = new Array();
                root.table = options.table
                root.attributes = options.attributes
                root.methods = options.methods

                root.new = function (presets) {
                        var presets = presets || {}

                        var newRecord = {}

                        for (attribute in root.attributes) { newRecord[attribute]=presets[attribute] || null }

                        for (method in root.methods) { newRecord[method] = root.methods[method] }

                        newRecord.save = function() {

                                var deferred = $q.defer();

                                if (this.id) {
                                        console.log("need something to update existing records")
                                } else {
                                        var newData = {}
                                        for (attribute in root.attributes) { newData[attribute]=this[attribute] || null }
                                        var newObj = new (Parse.Object.extend(root.table))
                                        record=this
                                        newObj.save(newData).then(function(e) {                                                
                                                record.id = e.id
                                                deferred.resolve()
                                        });                                        
                                }

                                return deferred.promise;
                        }

                        data.push(newRecord)
                        return newRecord
                }                                

                root.recache = function()  {
                        deferred = $q.defer();

                        data = [];
                        (new Parse.Query(root.table)).find().then(function(ret) {                                
                                ret.forEach(function(record){                                        
                                        newRecord = root.new();
                                        for (attribute in root.attributes) {
                                                newRecord[attribute]=record.get(attribute)
                                        }
                                        newRecord.id = record.id                                                                                
                                })
                                deferred.resolve();
                        })

                        return deferred.promise

                }

                root.all = function () { return data }

                root.filterBy = function(query) {                         
                        return data.filter(function(record) {
                                
                                for(field in query) {
                                                               
                                        if (query[field]!=record[field]) { return false }
                                }
                                
                                return true
                        })
                }
                
        }


        //DEFINITION MODELS
        
        models = {}
        models.category = new Model({
                table: "Category", 
                attributes: { 
                        label:null 
                }
        })
        models.location = new Model({ 
                table: "Location", 
                attributes: {
                        descriptiveTitle:null,
                        descriptiveInformation: null,
                        enigmaticTitle:null,
                        enigmaticInformation:null,
                        image: null,
                        type: null,
                        geolocation: null,
                        category: { link_to:"category" }
                },
                methods: {
                        updateDistance: function(currentGeolocation) {
                                
                                lat1=this.geolocation.latitude
                                lon1=this.geolocation.longitude
                                lat2=currentGeolocation.latitude
                                lon2=currentGeolocation.longitude
                                
                                function deg2rad(deg) {
                                        return deg * (Math.PI/180)
                                }
                                var R = 6371; // Radius of the earth in km
                                var dLat = deg2rad(lat2-lat1);  // deg2rad below
                                var dLon = deg2rad(lon2-lon1); 
                                var a = 
                                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
                                    Math.sin(dLon/2) * Math.sin(dLon/2)
                                ; 
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                                var d = R * c; // Distance in km
                                this.distance = Math.round(d*1000)
                                return this.distance
                        }
                }
        })

        
        //RECACHE MODELS
        models.category.recache().then(function() { 
                models.location.recache().then(function() {
                        //console.log(models.category.all()) 
                        //console.log(models.location.all())                                                 
                })
        })


        return models;
});
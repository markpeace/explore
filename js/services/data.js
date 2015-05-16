app.service('DataService', function($q, $state) {

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
                for (a in root.attributes) { root.attributes[a] = root.attributes[a] || {} }        
                root.methods = options.methods

                root.new = function (presets) {
                        var presets = presets || {}

                        var newRecord = {}

                        for (attribute in root.attributes) { newRecord[attribute]=presets[attribute] || null }

                        for (method in root.methods) { newRecord[method] = root.methods[method] }

                        newRecord.save = function() {

                                record=this                                                               

                                var deferred = $q.defer();

                                _getObject = function() {

                                        if (record.id) {

                                                (new Parse.Query(Parse.Object.extend(root.table)))
                                                        .get(record.id).then(function(e) { _performSave(e); })

                                        } else {

                                                _performSave( new (Parse.Object.extend(root.table)) );

                                        }

                                }

                                _performSave = function(r) {

                                        for (attribute in root.attributes) {
                                                if(root.attributes[attribute].type=='image' && record[attribute]) {
                                                        var base64=record[attribute]
                                                        record[attribute] = new Parse.File("myfile.jpg", { base64: base64 });                                                              
                                                }
                                                r.set(attribute, record[attribute] || null); 

                                        }

                                        r.save().then(function() {
                                                deferred.resolve();
                                        })

                                }

                                _getObject();

                                return deferred.promise;
                        }

                        newRecord.delete = function() {

                                if(!this.id) { return }

                                record = this                                                                
                                var deferred = $q.defer();                               

                                (new Parse.Query(Parse.Object.extend(root.table)))
                                        .get(this.id).then(function(e) {
                                        e.destroy().then(function() { deferred.resolve() })
                                })

                                data=data.filter(function(d) { return d.id!=record.id })

                                return deferred.promise;                               
                        }

                        data.push(newRecord)
                        return newRecord
                }                                

                root.recache = function()  {
                        deferred = $q.defer();

                        data = [];
                        (new Parse.Query(root.table)).limit(99999).find().then(function(ret) {                                
                                ret.forEach(function(record){                                        
                                        newRecord = root.new();
                                        for (attribute in root.attributes) {
                                                if(root.attributes[attribute].type=='image' && record.get(attribute)) {
                                                        //newRecord[attribute]=record.get(attribute).url();
                                                } else {
                                                        newRecord[attribute]=record.get(attribute)       
                                                }
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
                        image: { type: 'image' } ,
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
                        $state.reload();                                             
                })
        })


        return models;
});
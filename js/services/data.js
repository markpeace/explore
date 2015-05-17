app.service('DataService', function($q, $state, $ionicLoading) {

        var app_id = "uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz";
        var js_key = "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N";
        Parse.initialize(app_id, js_key);

        if(user=window.localStorage.getItem("key")) {

        } else {
                var user = new Parse.User();
                user.set("username", "my name");
                user.set("password", "my pass");
                try {
                        alert(device.uuid)
                } catch (ex) {
                        alert(ex.message)
                }
                /*
                user.signUp(null, {
                        success: function(user) {
                                // Hooray! Let them use the app now.
                        },
                        error: function(user, error) {
                                // Show the error message somewhere and let the user try again.
                                alert("Error: " + error.code + " " + error.message);
                        }
                });*/
        }              

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

                        newRecord.recache = function() {

                                var record = this;
                                var deferred = $q.defer();

                                (new Parse.Query(Parse.Object.extend(root.table)))
                                        .get(record.id).then(function(remoteRecord) { 

                                        for (attribute in root.attributes) {

                                                if(root.attributes[attribute].type=='image' && remoteRecord.get(attribute)) {
                                                        record[attribute]=remoteRecord.get(attribute).url();
                                                } else if (root.attributes[attribute].link_to && remoteRecord.get(attribute)) {
                                                        record[attribute]=root.attributes[attribute].link_to.filterBy({id:remoteRecord.get(attribute).id})[0]
                                                } else {
                                                        record[attribute]=remoteRecord.get(attribute)       
                                                }

                                                deferred.resolve()
                                        }

                                })

                                return deferred.promise

                        }

                        newRecord.save = function() {

                                record=this                                                               

                                var deferred = $q.defer();

                                _doValidations = function() {
                                        errorString = "";

                                        for (attribute in root.attributes) {
                                                if (root.attributes[attribute].required && !record[attribute]) {
                                                        errorString+="- " + attribute + " is a required field"
                                                }
                                        }       

                                        if (errorString) {
                                                deferred.reject(errorString);
                                                return;
                                        } else {
                                                _getObject()
                                        }
                                }

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
                                                if(root.attributes[attribute].type=='image' && record[attribute] ) {
                                                        if(record[attribute].substr(0,4)!="http") {
                                                                var base64=record[attribute]
                                                                record[attribute] = new Parse.File("myfile.jpg", { base64: base64 });      
                                                                r.set(attribute, record[attribute] || null);
                                                        }
                                                } else if (root.attributes[attribute].link_to) {

                                                        var id = record[attribute].id
                                                        record[attribute] = new (Parse.Object.extend(root.attributes[attribute].link_to.table))
                                                        record[attribute].id = id
                                                        r.set(attribute, record[attribute] || null);

                                                } else {
                                                        r.set(attribute, record[attribute] || null);
                                                }


                                        }

                                        r.save().then(function(e) {
                                                record.id=e.id
                                                record.recache().then(function() {
                                                        deferred.resolve();       
                                                })                                                
                                        })

                                }

                                _doValidations();

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
                        var deferred = $q.defer();

                        var promises = []

                        data = [];
                        (new Parse.Query(root.table)).limit(99999).find().then(function(ret) {                                
                                ret.forEach(function(r){                                        
                                        newRecord = root.new();
                                        newRecord.id = r.id;
                                        promises.push(newRecord.recache()); 
                                })

                                $q.all(promises).then(function() {
                                        deferred.resolve();
                                })

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
                        label:{ required: true } 
                }
        })
        models.group = new Model({
                table: "Group",
                attributes: {
                        label: { required: true }
                }
        })
        models.location = new Model({ 
                table: "Location", 
                attributes: {
                        descriptiveTitle: { required: true },
                        descriptiveInformation: { required: true },
                        enigmaticTitle:null,
                        enigmaticInformation:null,
                        image: { type: 'image' } ,
                        type: { required: true },
                        geolocation: { required: true },
                        category: { link_to:models.category, required:true }
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

        $ionicLoading.show({
                template: 'Updating Data...'
        });

        //RECACHE MODELS
        models.category.recache().then(function() { 
                models.group.recache().then(function() {
                        models.location.recache().then(function() {
                                //console.log(models.category.all()) 
                                //console.log(models.location.all())  
                                $ionicLoading.hide();  
                        })
                })
        })



        return models;
});
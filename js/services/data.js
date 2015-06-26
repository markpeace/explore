app.service('DataService', function($rootScope, ParseConnector, $q, $state, $ionicLoading) {

        var model = {}

        ParseConnector.initialise({
                app_id: "uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz",
                javascript_key: "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N"
        }).then(function(returned_model) {

                returned_model.user.securityLevel = 1;

                createModels(returned_model)
        })


        var definitions = {

                user: {
                        table: 'User',
                        parse_update_delay:0,
                        delay_relationship_load: true,
                        attributes: {
                                groups: { link_to: ['Group'] }
                        },
                        methods: {
                                securityLevel: function(override) {

                                        record=this

                                        if(override) record._securityLevel = override

                                        if(!record._securityLevel) {
                                                record._securityLevel=9999

                                                record.groups.data.forEach(function(g) {
                                                        record._securityLevel = g.securityLevel < record._securityLevel ? g.securityLevel : record._securityLevel
                                                })

                                                console.info("calculated security level: "+record._securityLevel)
                                        }

                                        return record._securityLevel;
                                },
                        }
                },
                group: {
                        table: 'Group',
                        attributes: {
                                label: {},
                                securityLevel: {},
                                users: { link_to: ['User'] }
                        },
                        acl: {
                                public: {read:true, write:true},
                                read_roles: ['superadministrator', 'administrator'],
                                write_roles: ['superadministrator', 'administrator']
                        }
                },
                category: {
                        table: "Category", 
                        attributes: { 
                                label:{ required: true } 
                        }
                },
                location: { 
                        table: "Location", 
                        attributes: {
                                descriptiveTitle: { required: true },
                                descriptiveInformation: { required: true },
                                enigmaticTitle: {},
                                enigmaticInformation: {},
                                image: { type: 'image' } ,
                                type: { required: true },
                                geolocation: { required: true },
                                categories: { link_to:["Category"], required:true }
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
                }
        }

        var createModels = function(returned_model) {
                console.log("create");

                var promises = []

                for(m in definitions) { 
                        definitions[m].parse_update_delay=0;
                        window.localStorage.removeItem(definitions[m].table)
                        model[m] = new ParseConnector.Model(definitions[m]); 
                        promises.push(model[m].cache_promise) 
                        promises.push(model[m].relationship_update_promise) 
                }

                $q.all(promises).then(function() {
                                                                        
                        model.user=model.user.data[0]
                        model._loadcomplete=true;
                        console.log(model)                        
                        $rootScope.$broadcast('DataService:DataLoaded');
                })

        }


        return model;   



        /*        models=ParseConnector.connect("uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz", "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N")        

        Parse.User.logOut();
        window.localStorage.removeItem("key")

        getUser = function () {

                var deferred = $q.defer();

                Parse.User.logOut();

                if(!(id=window.localStorage.getItem("key"))) {                
                        id = typeof device !== 'undefined' ? device.uuid : "x" + (Math.random()*9999);
                        window.localStorage.setItem("key", id);                
                }                      

                Parse.User.logIn(id, id, {
                        success: function(user) {
                                console.log("signed in")
                                deferred.resolve(user)
                        },
                        error: function(user, error) {

                                var user = new Parse.User();
                                user.set("username", id);
                                user.set("password", id);                                

                                acl = new Parse.ACL()
                                //acl.setPublicReadAccess(true);
                                user.setACL(acl);                                

                                user.signUp(null, {
                                        success: function(user) {
                                                console.log("registered");
                                                deferred.resolve(user)
                                        },
                                        error: function(user, error) {
                                                alert("A weird user error occurred!");  
                                                alert(error.message)
                                        }
                                });
                        }
                });

                return deferred.promise

        }

        //DEFINITION MODELS

        definitions = {

                group: {
                        table: "Group",
                        attributes: {
                                label: { required: true },
                                securityLevel: {},
                                users: { link_to: ["models.user"] }
                        }
                }, 
                user: {
                        table: "User",
                        attributes: {
                                groups: { link_to: ["models.group"] }
                        },
                        methods: {

                                joinGroup: function() {

                                        var deferred = $q.defer

                                        user = this

                                        if(typeof cordova=="undefined") {
                                                alert("Sorry, you can only do this using the QR Reader of a mobile device");
                                                deferred.resolve()
                                                return deferred.promise;
                                        }

                                        var deferred = $q.defer()

                                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                                        scanner.scan(function (result) {


                                                group = models.group.filterBy({id:result.text})[0]

                                                user.groups.add(group).then(function() {
                                                        group.users.add(user).then(function () {

                                                                if(group.securityLevel<user._securityLevel) {
                                                                        user.securityLevel(group.securityLevel)
                                                                }

                                                                deferred.resolve();

                                                        });                          
                                                })       

                                        })

                                        return deferred.promise


                                }


                        }
                },

        }


        for (d in definitions) { models[d] = new ParseConnector.Model(definitions[d])}

        $ionicLoading.show({
                template: 'Updating Data...'
        });


        //RECACHE MODELS
        models.isComplete=false;
        getData = function() {               
                models.category.recache().then(function() { 
                        models.group.recache().then(function() {
                                models.location.recache().then(function() {
                                        models.user.constraints = [".equalTo('objectId', '"+ Parse.User.current().id +"')"]
                                        models.user.recache().then(function() {
                                                models.isComplete=true;
                                                $ionicLoading.hide();  
                                        })
                                })
                        })
                })
        }


        // BUILD EVERYTHING
        var user = Parse.User.current();
        if(!user) {
                getUser().then(getData);        
        } else {
                getData();
        };                



        return models;
        */
});
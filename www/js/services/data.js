app.service('DataService', function($rootScope, $ionicUser, $ionicPush, ParseConnector, $q, $state, $ionicLoading) {

        var model = {}

        //alert(window)
        //Parse.usingTestServer = true;
        //if(typeof cordova === 'object' && typeof window.WeinreServerId === "undefined") { Parse.usingTestServer = false; }        

        Parse.usingTestServer=true

        if(Parse.usingTestServer == false) {
                var app_id = "KfqGRavMzc841BHvxAsyINMkJaVrsHHGwszMMA9r";
                var js_key = "mkEtbCsmnhtB0sOSPyI93rH2e4flkWOk1TtWwmH3";                
        } else {
                var app_id = "uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz";
                var js_key = "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N";


        }

        Parse.initialize(app_id, js_key);


        ParseConnector.initialise({
                app_id: app_id,
                javascript_key: js_key
        }).then(function(returned_model) {

                returned_model.user.securityLevel = 1;

                createModels(returned_model)
        })


        var definitions = {

                user: {
                        table: 'User',
                        parse_update_delay:0,
                        delay_relationship_load: true,
                        constraints: [".equalTo('objectId', Parse.User.current().id)"],
                        attributes: {
                                username: {},
                                token: {},
                                groups: { link_to: ['Group'] },
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
                                joinGroup: function () {
                                        var deferred = $q.defer()

                                        if(typeof cordova=="undefined") {
                                                alert("Sorry, you can only do this using the QR Reader of a mobile device");
                                                deferred.resolve()
                                                return deferred.promise;
                                        }

                                        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

                                        scanner.scan(function (result) {


                                                group = model.group.filterBy({id:result.text})[0]
                                                user = model.user

                                                user.groups.add(group)
                                                group.users.add(user)

                                                $q.all([user.save(), group.save()]).then(function() {

                                                        user._securityLevel = undefined

                                                        user.securityLevel();

                                                        deferred.resolve();
                                                })       

                                        })

                                        return deferred.promise

                                }
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
                                read_roles: ['Superadministrator', 'Administrator'],
                                write_roles: ['Superadministrator', 'Administrator']
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
                                range: { required: true },
                                categories: { link_to:["Category"], required:true },
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
                                },
                                _distance: function() { return this.distance },
                                inRange: function() {                                                  
                                        range = this.range > this.geolocation.accuracy ? this.range : this.geolocation.accuracy+this.range                                       
                                        return this._distance()<range
                                },
                                found: function() {                                       
                                        var root=this
                                        return (model.checkin.filterBy({ location:root }).length>0)
                                },
                                checkin_icon: function () {
                                        return {
                                                "GPS" : "ion-location",
                                                "QR" : "ion-qr-scanner",
                                                "SELF" : "ion-person",
                                        }[this.type]
                                }                              
                        }
                },
                checkin: {
                        table: "Checkin",
                        constraints: [".equalTo('user', Parse.User.current())"],
                        attributes: {
                                user: { required: true, link_to: 'User' },
                                location: { required: true, link_to: 'Location' },
                                photo: { type: 'image' } ,
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

                        $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
                                model.user.token = data.token
                                model.user.save();
                        });

                        $ionicPush.register({
                                canShowAlert: false, //Should new pushes show an alert on your screen?
                                canSetBadge: true, //Should new pushes be allowed to update app icon badges?
                                canPlaySound: false, //Should notifications be allowed to play a sound?
                                canRunActionsOnWake: true, // Whether to run auto actions outside the app,
                                onNotification: function(notification) {
                                        alert("Notification!")
                                }
                        },{
                                user_id: model.user.username
                        }); 


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
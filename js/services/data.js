app.service('DataService', function(ParseConnector, $q, $state, $ionicLoading) {

        models=ParseConnector.connect("uvoFo97lY6pA2Bo24ZfHvptkLorJveZmcJ2GIeDz", "sYzm2V5ylN7nGNlediCexynKV5HyHRQIxtJMXI4N")        

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

                                user.signUp(null, {
                                        success: function(user) {
                                                console.log("registered");
                                                deferred.resolve(user)
                                        },
                                        error: function(user, error) {
                                                alert("A weird user error occurred!");                                                
                                        }
                                });
                        }
                });

                return deferred.promise

        }

        //DEFINITION MODELS

        definitions = {
                category: {
                        table: "Category", 
                        attributes: { 
                                label:{ required: true } 
                        }
                },
                group: {
                        table: "Group",
                        attributes: {
                                label: { required: true },
                                users: { link_to: ["models.user"] }
                        }
                },
                user: {
                        table: "User",
                        attributes: {
                                groups: { link_to: ["models.group"] }
                        }
                },
                location: { 
                        table: "Location", 
                        attributes: {
                                descriptiveTitle: { required: true },
                                descriptiveInformation: { required: true },
                                enigmaticTitle:null,
                                enigmaticInformation:null,
                                image: { type: 'image' } ,
                                type: { required: true },
                                geolocation: { required: true },
                                category: { link_to:"models.category", required:true }
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


        for (d in definitions) { models[d] = new ParseConnector.Model(definitions[d])}

        $ionicLoading.show({
                template: 'Updating Data...'
        });


        //RECACHE MODELS
        getData = function() {               
                models.category.recache().then(function() { 
                        models.group.recache().then(function() {
                                models.location.recache().then(function() {
                                        models.user.constraints = [".equalTo('objectId', '"+ Parse.User.current().id +"')"]
                                        models.user.recache().then(function() {
                                                //console.log(models.user.all()[0].groups.all())
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
});
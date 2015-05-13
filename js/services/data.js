app.service('DataService', function() {

        cache = {
                dataUpdate: new Date(),
                categories: [],
                locations: []
        }

        //Generate Random Categories
        for(x=0; x<10; x++) {
                cache.categories.push({ id: x, label: "Category #" + x })
        }

        //Generate Random Clues        
        for(x=0; x<100; x++) {
                cache.locations.push({
                        me:this,
                        id: x,
                        title:"Location #" + x,
                        category: cache.categories[Math.round(Math.random() * cache.categories.length)],
                        clue: "The clue guides participants towards the site - it should be accessible, but offer challenge",
                        photo: ["","http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png"][Math.round(Math.random() * 0.75)],
                        information: "The informatio is the blurb which appears once a participant has found a particular clue - it should offer context and information on the site.",
                        type: ['GPS','QR','SELF'][Math.round(Math.random() * 3)],
                        geolocation: { latitude:0, longitude:0 },
                        distance: 100000,
                        found: Math.round(Math.random() * 0.75),
                        updateDistance: function(coords) {
                                if(this.geolocation.latitude==0) {
                                        this.geolocation.latitude=coords.latitude + (Math.random()/500)
                                        this.geolocation.longitude=coords.longitude + (Math.random()/500)
                                }
                                
                                this.distance=getDistance(this.geolocation.latitude, this.geolocation.longitude, coords.latitude, coords.longitude)                               
                        }
                })
        }         

        // HELPER FUNCTIONS
        getDistance= function(lat1, lon1, lat2, lon2) {
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
                return Math.round(d*1000);
        }


        return {
                locations:  cache.locations
        };
});
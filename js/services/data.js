app.service('DataService', function() {

        cache = {
                categories: [],
                clues: []
        }
        
        //Generate Random Categories
        for(x=0; x<10; x++) {
                cache.categories.push({ id: x, label: "Category #" + x })
        }
               
        //Generate Random Clues        
        for(x=0; x<100; x++) {
                cache.clues.push({
                        id: x,
                        title:"Location #" + x,
                        category: cache.categories[Math.round(Math.random() * cache.categories.length)],
                        enigma: "The enigma is a 'clue' which guides participants towards the site - it should be accessible, but offer challenge",
                        photo: ["","http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png"][Math.round(Math.random() * 0.75)],
                        information: "The informatio is the blurb which appears once a participant has found a particular clue - it should offer context and information on the site.",
                        type: ['Checkin','QR Code','Selfie'][Math.round(Math.random() * 3)],
                        distance: Math.round(Math.random() * 2500),
                        found: Math.round(Math.random() * 0.75),
                })
        }                        
        
        return {
                clues: cache.clues
        };
});
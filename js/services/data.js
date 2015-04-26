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
                        title:"Clue #" + x,
                        category: cache.categories[Math.round(Math.random() * cache.categories.length)],
                        distance: Math.round(Math.random() * 2500),
                        found: Math.round(Math.random() * 0.75)
                })
        }                        
        
        return {
                clues: cache.clues
        };
});
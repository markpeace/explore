Parse.Cloud.afterSave("Group", function(request) {

        request.object.set("cloudcode", "YES")
        request.object.save();
        
});
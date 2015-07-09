Parse.Cloud.afterSave("Group", function(request) {

        if(!request.object.get("securityLevel")) { request.object.set("securityLevel", 9999).save(); }

        if(request.object.get("securityLevel")<9999) {

                request.object.set("cloudcode", "YES")
                request.object.save();

        }       
});
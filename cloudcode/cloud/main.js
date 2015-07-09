Parse.Cloud.afterSave("Group", function(request) {

        addRole = function(group) {
                
                (new Parse.Query(Parse.Role))
                        .equalTo("name", group.get("label"))
                        .find().then(function(role) {
                        if (role.length>0) {
                                addUsers(role[0], group)                                
                        } else {

                                console.log("creating");
                                
                                var roleACL = new Parse.ACL();
                                roleACL.setPublicReadAccess(true);
                                ["Superadministrator"].forEach(function(role) {
                                        roleACL.setRoleWriteAccess(role,true);
                                        roleACL.setRoleReadAccess(role,true);        
                                })


                                var role = new Parse.Role(group.get("label"), roleACL);
                                role.save().then(function(role) {
                                        addUsers(role, group)
                                },function(e) {
                                        console.log(e.message)
                                })
                        }
                })  
        }

        addUsers = function (role, group) {

                var _role = role
                var _group = group

                console.log("processing role:" + role.get('name'))

                group.relation("users").query().find().then(function(users){       

                        if(users.length>0) {                      

                                console.log("found users:" + users.length)

                                users.forEach(function(user) {
                                        console.log(user)
                                        _role.getUsers().add(user)
                                })

                                _role.save().then(function(){
                                        console.log("done")
                                }, function(e) {
                                        console.log(e.message)
                                })

                        }
                })

        }


        if(!request.object.get("securityLevel")) { request.object.set("securityLevel", 9999).save(); }

        if(request.object.get("securityLevel")<9999) {

                addRole(request.object)

        }       

});
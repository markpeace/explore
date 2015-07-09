Parse.Cloud.afterSave("Group", function(request) {

        Parse.Cloud.useMasterKey();
        
        addRole = function(group) {

                console.log("called addrole");

                (new Parse.Query(Parse.Role))
                        .equalTo("name", group.get("label"))
                        .find().then(function(role) {
                        console.log("done find")
                        if (role.length>0) {

                                console.log("didn't need to create the role");

                                addUsers(role[0], group)                                
                        } else {

                                console.log("creating the role...");

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
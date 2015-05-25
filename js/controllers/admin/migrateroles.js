app.controller('MigrateRoles', function($scope, $q, DataService) { 

        getGroups = function() {
                (new Parse.Query("Group")).lessThan("securityLevel",100).find().then(function(groups) {
                        groups.forEach(function(group) {
                                addRole(group)
                        })
                })  
        }

        addRole = function(group) {

                (new Parse.Query(Parse.Role))
                        .equalTo("name", group.get("label"))
                        .find().then(function(role) {
                        if (role.length>0) {
                                addUsers(role[0], group)                                
                        } else {
                                var roleACL = new Parse.ACL();
                                roleACL.setPublicReadAccess(true);
                                roleACL.setRoleWriteAccess("Administrator",true);
                                roleACL.setRoleWriteAccess("Superadministrator",true);
                                var role = new Parse.Role(group.get("label"), roleACL);
                                role.save().then(function(role) {
                                        addUsers(role, group)
                                })
                        }
                })  
        }

        addUsers = function (role, group) {

                var _role = role
                var _group = group

                group.relation("users").query().find().then(function(users){       
                        
                        if(users.length>0) {                               
                                
                                users.forEach(function(user) {
                                        _role.getUsers().add(user)
                                })

                                _role.save().then(function(){
                                        console.log("done")
                                })

                        }
                })

        }




        getGroups();
        return;

});
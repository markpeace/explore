app.service('ParseConnector', function($q, $state) {

        var models = {} 

        var Model = function (options) {

                //DEFINE MODEL ATTRIBUTES                
                var _model=this             

                _model.table = options.table

                _model.writeRoles = _model.writeRoles || ["Superadministrator", "Administrator"] 
                
                _model.attributes = options.attributes
                for (a in _model.attributes) { _model.attributes[a] = _model.attributes[a] || {} }            
                _model.methods = options.methods

                _model.data = new Array();

                _model.recache = function()  {

                        var deferred = $q.defer();
                        var promises = []

                        _model.data = [];

                        var query = new Parse.Query(_model.table)

                        if (_model.constraints) {
                                _model.constraints.forEach(function(constraint) {
                                        query=eval("query" + constraint)   
                                }) 
                        }

                        query.limit(99999).find().then(function(ret) {                                
                                ret.forEach(function(r){                                        
                                        newRecord = _model.new();
                                        newRecord.id = r.id;
                                        newRecord.parseObject = r
                                        promises.push(newRecord.recache()); 
                                })

                                $q.all(promises).then(function() {
                                        deferred.resolve();
                                })

                        })

                        return deferred.promise

                }

                _model.all = function () { return _model.data }

                _model.filterBy = function(query) {                         
                        return _model.data.filter(function(record) {

                                for(field in query) {

                                        if (query[field]!=record[field]) { return false }
                                }

                                return true
                        })
                }

                _model.new = function (presets) {
                        var presets = presets || {}

                        var _newRecord = {}
                        _newRecord.model = _model

                        for (attribute in _model.attributes) { _newRecord[attribute]=presets[attribute] || null }

                        for (method in _model.methods) { _newRecord[method] = _model.methods[method] }

                        _newRecord.recache = function() {

                                var record = this;
                                var deferred = $q.defer();

                                var query = new Parse.Query(Parse.Object.extend(_model.table))                                                                                               

                                query.get(record.id).then(function(remoteRecord) { 


                                        for (var attribute in _model.attributes) {

                                                if(_model.attributes[attribute].type=='image' && remoteRecord.get(attribute)) {
                                                        record[attribute]=remoteRecord.get(attribute).url();            
                                                } else if (_model.attributes[attribute].link_to ) {

                                                        var connector = _model.attributes[attribute].link_to

                                                        if(typeof _model.attributes[attribute].link_to==="string") {                                                                
                                                                record[attribute]=eval(connector).filterBy({id:remoteRecord.get(attribute).id})[0]
                                                        } else {

                                                                /// TOMORROW YOU NEED TO ADD SOMETHING THAT DELAYS THIS IF IT'S NOT YET REFRESHED

                                                                var connector=eval(connector[0])                                                                     

                                                                record[attribute] = new Model(connector);                                                               
                                                                var _localRecord = record[attribute]
                                                                _localRecord.parent=record
                                                                _localRecord.columnName = attribute

                                                                remoteRecord.relation(attribute).query().find().then(function(subrecords){          

                                                                        subrecords.forEach(function(subrecord) {

                                                                                var existingForeignRecord = connector.filterBy({id:subrecord.id})[0]
                                                                                if (existingForeignRecord) {
                                                                                        var newSubRecord =_localRecord.new(existingForeignRecord);
                                                                                        newSubRecord.id = existingForeignRecord.id
                                                                                        newSubRecord.parseObject = existingForeignRecord.parseObject
                                                                                        newSubRecord.parent = _localRecord
                                                                                        newSubRecord.remove = function() { return _remove(newSubRecord) }
                                                                                } else {
                                                                                        var newForeignRecord = connector.new()
                                                                                        newForeignRecord.id = subrecord.id
                                                                                        newForeignRecord.recache().then(function(newForeignRecord){
                                                                                                var newSubRecord =_localRecord.new(newForeignRecord);
                                                                                                newSubRecord.id = newForeignRecord.id
                                                                                                newSubRecord.parseObject = newForeignRecord.parseObject
                                                                                                newSubRecord.parent = _localRecord
                                                                                                newSubRecord.remove = function() { return _remove(newSubRecord) }
                                                                                        })
                                                                                }

                                                                                _remove = function (record) {

                                                                                        var deferred = $q.defer()

                                                                                        record.parent.parent.parseObject.relation(record.parent.columnName).remove(record.parseObject)
                                                                                        record.parent.parent.parseObject.save().then(function() {
                                                                                                record.parent.data=record.parent.all().filter(function(child) {
                                                                                                        if(child.id!=record.id) return true
                                                                                                        return false
                                                                                                })                                                                                    
                                                                                                deferred.resolve();
                                                                                        })

                                                                                        return deferred.promise

                                                                                }


                                                                        })                                                                        
                                                                })   

                                                                _localRecord.add = function(remoteRecord) {

                                                                        var deferred = $q.defer()

                                                                        var newSubrecord = _localRecord.new(remoteRecord)
                                                                        newSubrecord.id=remoteRecord.id;

                                                                        _localRecord.parent.parseObject.relation(_localRecord.columnName)
                                                                                .add(remoteRecord.parseObject)
                                                                        _localRecord.parent.parseObject.save().then(function() {
                                                                                deferred.resolve();
                                                                        })

                                                                        return deferred.promise;
                                                                }

                                                        }


                                                } else {
                                                        record[attribute]=remoteRecord.get(attribute)    
                                                }

                                                record.parseObject=remoteRecord

                                                deferred.resolve(record)
                                        }


                                })

                                return deferred.promise

                        }

                        _newRecord.save = function() {

                                record=this                                                               

                                var deferred = $q.defer();

                                _doValidations = function() {

                                        console.info("_doValidations")

                                        errorString = "";

                                        for (attribute in _model.attributes) {
                                                if (_model.attributes[attribute].required && !record[attribute]) {
                                                        errorString+="- " + attribute + " is a required field"
                                                }
                                        }       

                                        if (errorString) {
                                                deferred.reject(errorString);
                                                return;
                                        } else {
                                                _getObject()
                                        }
                                }

                                _getObject = function() {

                                        console.info("_getObject")

                                        if (record.id) {

                                                (new Parse.Query(Parse.Object.extend(_model.table)))
                                                        .get(record.id).then(function(e) { _performSave(e); })

                                        } else {

                                                _performSave( new (Parse.Object.extend(_model.table)) );

                                        }

                                }

                                _performSave = function(r) {

                                        console.info("_performSave")

                                        for (attribute in _model.attributes) {
                                                if(_model.attributes[attribute].type=='image' && record[attribute] ) {
                                                        if(record[attribute].substr(0,4)!="http") {
                                                                var base64=record[attribute]
                                                                record[attribute] = new Parse.File("myfile.jpg", { base64: base64 });      
                                                                r.set(attribute, record[attribute] || null);
                                                        }
                                                } else if (_model.attributes[attribute].link_to && record[attribute]) {

                                                        var id = record[attribute].id
                                                        record[attribute] = new (Parse.Object.extend(eval(_model.attributes[attribute].link_to).table))
                                                        record[attribute].id = id
                                                        r.set(attribute, record[attribute] || null);

                                                } else {
                                                        r.set(attribute, record[attribute] || null);
                                                }

                                        }

                                        var acl = new Parse.ACL();
                                        acl.setWriteAccess(Parse.User.current(), true);
                                        
                                        _model.writeRoles.forEach(function(role) {
                                                acl.setRoleWriteAccess(role, true);
                                        })
                                        
                                        acl.setPublicReadAccess(true); 
                                        r.setACL(acl);

                                        r.save().then(function(e) {

                                                console.info("final save")                                                

                                                record.id=e.id
                                                record.recache().then(function() {
                                                        deferred.resolve();       
                                                })                                                
                                        }, function(e) {
                                                alert(e)
                                                alert(e.message)
                                        })

                                }

                                _doValidations();

                                return deferred.promise;
                        }

                        _newRecord.delete = function() {

                                if(!this.id) { return }

                                record = this                                                                
                                var deferred = $q.defer();                               

                                (new Parse.Query(Parse.Object.extend(_model.table)))
                                        .get(this.id).then(function(e) {
                                        e.destroy().then(function() { deferred.resolve() })
                                })

                                _model.data=_model.data.filter(function(d) { return d.id!=record.id })

                                return deferred.promise;                               
                        }

                        _model.data.push(_newRecord)
                        return _newRecord
                }                                

        }


        return {
                connect: function(app_id, javascript_key) {

                        Parse.initialize(app_id, javascript_key);                       
                        return models

                },
                Model:Model

        }

})
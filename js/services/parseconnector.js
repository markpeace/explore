app.service('ParseConnector', function($q, $state) {

        var models = {} 

        var Model = function (options) {

                //DEFINE MODEL ATTRIBUTES                
                var _model=this             

                _model.table = options.table
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
                                                } else if (_model.attributes[attribute].link_to && remoteRecord.get(attribute)) {

                                                        var connector = _model.attributes[attribute].link_to

                                                        if(typeof _model.attributes[attribute].link_to==="string") {                                                                
                                                                record[attribute]=eval(connector).filterBy({id:remoteRecord.get(attribute).id})[0]
                                                        } else {

                                                                var connector=eval(connector[0])

                                                                record[attribute] = new Model(connector);                                                               
                                                                var _localRecord = record[attribute]
                                                                
                                                                remoteRecord.relation(attribute).query().find().then(function(subrecords){                                                                        
                                                                        subrecords.forEach(function(subrecord) {
                                                                                var newSubRecord =_localRecord.new(connector.filterBy({id:subrecord.id})[0]);
                                                                                newSubRecord.id = subrecord.id
                                                                                newSubRecord.remove = function() {
                                                                                        console.warn("Need to write a function which removes a subrecord from a parent")
                                                                                }
                                                                        })                                                                        
                                                                })                                                                
                                                        }
                                                                console.log(_model.all()[0].groups)


                                                } else {
                                                        record[attribute]=remoteRecord.get(attribute)       
                                                }

                                                deferred.resolve()
                                        }

                                })

                                return deferred.promise

                        }

                        _newRecord.save = function() {

                                record=this                                                               

                                var deferred = $q.defer();

                                _doValidations = function() {
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

                                        if (record.id) {

                                                (new Parse.Query(Parse.Object.extend(_model.table)))
                                                        .get(record.id).then(function(e) { _performSave(e); })

                                        } else {

                                                _performSave( new (Parse.Object.extend(_model.table)) );

                                        }

                                }

                                _performSave = function(r) {

                                        for (attribute in _model.attributes) {
                                                if(_model.attributes[attribute].type=='image' && record[attribute] ) {
                                                        if(record[attribute].substr(0,4)!="http") {
                                                                var base64=record[attribute]
                                                                record[attribute] = new Parse.File("myfile.jpg", { base64: base64 });      
                                                                r.set(attribute, record[attribute] || null);
                                                        }
                                                } else if (_model.attributes[attribute].link_to) {

                                                        var id = record[attribute].id
                                                        record[attribute] = new (Parse.Object.extend(_model.attributes[attribute].link_to.table))
                                                        record[attribute].id = id
                                                        r.set(attribute, record[attribute] || null);

                                                } else {
                                                        r.set(attribute, record[attribute] || null);
                                                }


                                        }

                                        r.save().then(function(e) {
                                                record.id=e.id
                                                record.recache().then(function() {
                                                        deferred.resolve();       
                                                })                                                
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
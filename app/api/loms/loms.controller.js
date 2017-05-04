'use strict';

var LOMS = require('./loms.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash'),
	fs = require('fs'), 
	functions = require('./loms.functions.js'),
	mongoose = require('mongoose');
	
//ALL LOMS
	
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    LOMS.find({}, function (err, lom) {
        functions.controlErrors(err, res, lom);
    });
};

/**
 * Creates a new lom
 */
exports.create = function(req, res) {
    LOMS.create(req.body, function (err, lom) {
		
		if (err) { 
			console.log(err);
			res.status(err.code).send(err);
		}
        console.log('LOMS created!');
        var id = lom._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the lom with type: ' + lom.technical.format + ' and id: ' + id);
    });
};

/**
 * Destroys all loms
 */
exports.destroy  = function(req, res){
    LOMS.remove({}, function (err, resp) {
        functions.controlErrors(err, res, resp)
    });
};

//BY ID	

/**
 * Returns a lom by id
 */
exports.get = function (req, res) {
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
	    LOMS.findOne({_id: req.params.id}, function (err, lom) {
	       if (err) { 
			   console.log(err);
			   res.status(err.code).send(err);

		   } else if(!lom){
			   res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
		   } else {
	           res.json(lom);
		   }
	    });
	} else {
	   res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
	}
};

/**
 * Updates a lom by id
 */	
exports.update = function (req, res) {
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
		async.waterfall([
		    LOMS.findById.bind(LOMS, req.params.id),
		    function(lom, next) {
		        if(!lom) { 
					res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
				} else {
					var newLom = functions.doUpdate(lom, req.body);
					lom = _.extend(lom, newLom);
		       		lom.save(next);
				}
		    }
		], function(err, lom) {
		    functions.controlErrors(err, res, lom);
		});
	} else {
		res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
	}
};

/**
 * Removes a lom by id
 */
exports.remove = function (req, res) {
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
		async.waterfall([
		    LOMS.findById.bind(LOMS, req.params.id),
		    function(lom, next) {
				if(!lom) {
					res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
			    } else{
					LOMS.remove({_id: lom._id}, function (err, resp) {
				        functions.controlErrors(err, res,resp);
				    });
				}
		    }
		], function(err) {
		    if(err){
		    	console.log(err);
		    	res.status(err.code).send(err);
		    } else {
		    	res.sendStatus(200);
		    }
		});
	} else {
		res.status(404).send('The lom with id: ' + req.params.id + ' is not registrated');
	}
};



/**
 * Uploads a file in a lom
 */
exports.uploadFile =  function (req, res) {
	LOMS.findById(req.params.id, function(err, lom){
		if(!lom) { 
			res.status(404).send('The lom with id: '+  req.params.id +' is not registrated');
		} else {
			fs.stat(__dirname + '/../../res/files/' + req.params.id, function(err, stats){
				if(err) { fs.mkdir(__dirname + '/../../res/files/' + req.params.id); }
			});
			var file = __dirname + '/../../res/files/' + req.params.id + '/' + req.file.originalname;
	
			fs.readFile( req.file.path, function (err, data) {
				if(!data) {res.status(400).send('No data to upload');
				} else {
					fs.writeFile(file, data, function (err) {
						if( err ){
							console.error( err );
					        res.status(404).send(err);
						    res.end('Sorry, the file: '+  req.file.originalname + 
							' couldn\'t be uploaded in the lom with id: ' + req.params.id);

						}else{
						    res.end('File: '+  req.file.originalname + 
							' uploaded successfully in the lom with id: ' + req.params.id);
						}
					});
				}
			});
		}
			 
	});
};

/**
 * Downloads a file of a lom
 */
exports.downloadFile = function(req, res, next){
	var file = req.params.file;
	var path = __dirname + '/../../res/files/' + req.params.id + '/' + file;

  res.download(path, function(err){
	  if(err){
		  console.log( err );
		  res.status(404).send('Sorry, the file: '+  file +' couldn\'t be downloaded');
	  } else {
		  res.end('File: '+  file +' download successfully');	
	  }
  });
};



/**
 * Include photo in a lom
 */
exports.includePhoto =  function (req, res) {
	LOMS.findById(req.params.id, function(err, lom){
		if(!lom) { 
			res.status(404).send('The lom with id: '+  req.params.id +' is not registrated');
		} else {
			fs.stat(__dirname + '/../../res/files/photos/' + req.params.id, function(err, stats){
				if(err) { fs.mkdir(__dirname + '/../../res/files/photos/' + req.params.id); }
			});
			var file = __dirname + '/../../res/files/photos/' + req.params.id + '/' + req.file.originalname;
			lom.photo = file;
			fs.readFile( req.file.path, function (err, data) {
				if(!data) {res.status(400).send('No data to upload');
				} else {
					fs.writeFile(file, data, function (err) {
						if( err ){
							console.error( err );
					        res.status(404).send(err);
						    res.end('Sorry, the photo: '+  req.file.originalname + 
							' couldn\'t be uploaded in the lom with id: ' + req.params.id);

						}else{
						    res.end('Photo: '+  req.file.originalname + 
							' uploaded successfully in the lom with id: ' + req.params.id);
						}
					});
				}
			});
			lom.save();
		}
			 
	});
};


'use strict';

var LOMS = require('./loms.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	var fs = require("fs");


//ALL LOMS
	
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    LOMS.find({}, function (err, lom) {
        if (err) res.sendStatus(err.code);
        res.json(lom);
    });
};

/**
 * Creates a new lom
 */
exports.create = function(req, res) {
    LOMS.create(req.body, function (err, lom) {
		if (err) res.sendStatus(err.code);
        console.log('LOMS created!');
        var id = lom._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the lom with id: ' + id);
    });
};

/**
 * Destroys all loms
 */
exports.destroy  = function(req, res){
    LOMS.remove({}, function (err, resp) {
        if (err) res.sendStatus(err.code);
        res.json(resp);
    });
};

//BY ID	

/**
 * Returns a lom by id
 */
exports.get = function (req, res) {
    console.log(req.params.id)
    LOMS.findById(req.params.id, function (err, lom) {
       if (err) res.sendStatus(err.code);
        res.json(lom);
    });
};

/**
 * Updates a lom by id
 */	
exports.update = function (req, res) {
	async.waterfall([
	    LOMS.findById.bind(LOMS, req.params.id),
	    function(lom, next) {
	        lom = _.extend(lom, req.body);
	        lom.save(next);
	    }
	], function(err, lom) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!lom) {
	            res.sendStatus(404);
	        } else {
	            res.json(lom);
	        }
	    }
	});
};

/**
 * Removes a lom by id
 */
exports.remove = function (req, res) {
    console.log(req.params.id);
	async.waterfall([
	    LOMS.findById.bind(LOMS, req.params.id),
	    function(lom, next) {
		    LOMS.remove(lom, function (err, resp) {
		        if (err) res.sendStatus(err.code);
		        res.json(resp);
		    });
	    }
	], function(err, lom) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!lom) {
	            res.sendStatus(404);
	        } else {
	            res.json(lom);
	        }
	    }
	});
};

/**
 * Uploads a file in a lom
 */
exports.uploadFile =  function (req, res) {
	console.log(req.params.id);
	fs.stat(__dirname + "/files/" + req.params.id, function(err, stats){
		if(err) fs.mkdir(__dirname + "/files/" + req.params.id);
	});
	var file = __dirname + "/files/" + req.params.id + "/" + req.file.originalname;
	
	fs.readFile( req.file.path, function (err, data) {
		fs.writeFile(file, data, function (err) {
			if( err ){
				console.error( err );
		        res.status(err.code).send(err);
			    res.end('Sorry, the file: '+  req.file.originalname 
				+' couldn\'t be uploaded in the lom with id: ' + req.params.id);

			}else{
			    res.end('File: '+  req.file.originalname 
				+' uploaded successfully in the lom with id: ' + req.params.id);
			}
		});
	});
};

/**
 * Downloads a file of a lom
 */
exports.downloadFile = function(req, res, next){
  var file = req.params.file
    , path = __dirname + "/files/" + req.params.id + '/' + file;

  res.download(path, function(err){
	  if(err){
		  console.error( err );
		  res.status(err.code).send(err);
		  res.end('Sorry, the file: '+  file +' couldn\'t be downloaded');
	  } else {
		  res.end('File: '+  file +' download successfully');	
	  }
  });
};





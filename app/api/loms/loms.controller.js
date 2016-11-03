'use strict';

var LOMS = require('./loms.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');


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
 * Creates a new element
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
 * Destroys all elements
 */
exports.destroy  = function(req, res){
    LOMS.remove({}, function (err, resp) {
        if (err) res.sendStatus(err.code);
        res.json(resp);
    });
};
//BY ID	
/**
 * Returns an element by id
 */
exports.get = function (req, res) {
    console.log(req.params.id)
    LOMS.findById(req.params.id, function (err, lom) {
       if (err) res.sendStatus(err.code);
        res.json(lom);
    });
};
/**
 * Updates an element by id
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
 * Removes an element by id
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








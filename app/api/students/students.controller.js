'use strict';

var Students = require('./students.model.js'),
   config = require('../../res/config.js'), 
   async = require('async'),
   _ = require('lodash');


//ALL STUDENTS
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    Students.find({active: true}, function (err, student) {
        if (err) res.sendStatus(err.code);
		res.json(student);
    });
};

/**
 * Creates a new element
 */
exports.create = function(req, res) {
    Students.create(req.body, function (err, student) {
        if (err) res.sendStatus(err.code);
        console.log('Student created!');
        var id = student._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the student with id: ' + id);
    });
};
/**
 * Destroys all elements
 */
exports.destroy  = function(req, res){
    Students.remove({}, function (err, resp) {
        if (err) res.sendStatus(err.code);
        res.json(resp);
    });
};


//BY ID	
/**
 * Activates an element by ID
 */
exports.activate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: true});
	       	student.save(next);
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

/**
 * Deactivates an element by ID
 */
exports.deactivate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: false});
	       	student.save(next);
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};
/**
 * Returns an element by id
 */
exports.get = function (req, res) {
    Students.find({active: true, _id: req.params.id}, function (err, student) {
        if (err) res.sendStatus(err.code);
		res.json(student);
    });
};
/**
 * Updates an element by id
 */
exports.update = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students,  req.params.id),
	    function(student, next) {
			if(student.active == true) student = _.extend(student, req.body);
			student.save(next);
	
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
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
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
		    Students.remove(student, function (err, resp) {
		        if (err) res.sendStatus(err.code);
		        res.json(resp);
		    });
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};




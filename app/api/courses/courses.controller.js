'use strict';

/*
This version works with the following exported functions.
all: list all courses
get: list the course specified by course_name. 
	If there are several courses with the same name,
	then all of them will be showed
create: insert the course received as parameter
remove: delete the course received as parameter
update: update the course received as parameter
the new course is received via the request body in JSON format
update1: update the course received as parameter, but 
just the field with the value indicated via JSON 
format in the body of the request. 
*/

var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	

// Exporting all function
// list all courses
exports.all = function (req, res) 
	{
	// console.log(config)
    Courses.find({}, function (err, course) {
		if (err) res.sendStatus(err.code);
		res.json(course);
	});
};

// Exporting get function
// list the course specified by its name
// If there are several courses with the same name
// all of them will be showed
// If there are none with this name, then it returns an empty list []
exports.get = function (req, res){
	var courseId = req.params.id;
	Courses.find({"name" : courseId}, function(err, course) {
        if (err) 
			res.status(404).send(err);
		else {
			if (course.length > 0)
				res.status(200).json(course); 
			else 
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');  
		} 
	});
};

// Exporting remove function
// delete the course received as parameter
// If the course does not exist in the database, 
// it considers the course removed anyway
exports.remove = function(req,res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
			if(!course)
				res.status(404).send("The course with id: " + req.params.id + " is not registrated");
		    else{
				Courses.remove(course, function (err, resp) {
			        if (err)
						res.status(404).send(err);
			        else 
						res.json(resp);
			    });
			}
	    }
	], function(err, course) {
	    if (err) {
			console.log(err);
	        res.status(404).send(err);
	    } 
		else res.json(course);
	});
};

/**
 * Destroys all elements
 */
exports.reset  = function(req, res){
    Courses.remove({}, function (err, resp) {
	    if (err)
	        res.status(404).send(err);
		else 
			res.json(resp);
    });
};

// Exporting create function
// insert the course received as parameter
exports.create = function(req, res) {
    Courses.create(req.body, function (err, course) {
		if (err) res.sendStatus(err.code);
		console.log('Course created!');
		var id = course._id;
		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end('Added the course with id: ' + id);
	});
};

// Exporting update function
// update the course received as parameter
// the new course is received via the request body in JSON format
exports.update = function(req, res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
	        if(!course)
				res.status(404).send("The course with id: " + req.params.id + " is not registrated");
			else {
				course = _.extend(course, req.body);
	       		course.save(next);
			}
	    }
	], function(err, course) {
	    if (err) {
	        console.log(err);
	        res.status(404).send(err);
	    } 
		else res.json(course);
	});		
};

var update_field1 = function(courseId,field,value){
	Courses.findOne({"name" : courseId}, 
		function (err, course) {
			course[field] = value;
			course.save(function (err) {return err});
		}
	);
}

exports.update_course_field = function(courseId,field,value){
	var err = update_field1(courseId,field,value);
	return err;
}

// Exporting update function
// update the field of the course received as parameter
// it updates just the field with the value indicated via JSON 
// format in the body of the request. 
exports.update_field = function(req, res) {
	var err = update_field1(req.body.name,req.body.field,req.body.value);	
	if(err) {
		res.status(400).send('error while updating');
	}	
	else res.status(200).send('Updated the course with id: ' + req.body.name);
			
}

















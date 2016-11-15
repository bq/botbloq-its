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
exports.get = function (req, res) 
	{
	var courseId = req.params.id;
	Courses.find({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(500).send(err);} 
		else if (course) { res.status(200).json(course); } 
			 else { res.sendStatus(404);}    
	});
};

// Exporting remove function
// delete the course received as parameter
// If the course does not exist in the database, 
// it considers the course removed anyway
exports.remove = function(req,res) 
	{	
	var courseId = req.params.id;
	Courses.remove({"name" : courseId}, function(err) {
    if (!err) 
		{ console.log('Course removed: ');
		res.send('Course removed: ' + courseId)
		}
    else {
		console.log('error while removing');
		res.send('error while removing')
		}	
	});
};

// Exporting create function
// insert the course received as parameter
exports.create = function(req, res) {
	console.log('course body',req.body);
    Courses.create(req.body, 
		function (err, course) {
			if (err) res.sendStatus(err.code);
			console.log('Course created!');
			var id = course._id;
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Added the course with id: ' + id);
		}
	);
};

// Exporting update function
// update the course received as parameter
// the new course is received via the request body in JSON format
exports.update = function(req, res) {
	var courseId = req.params.id;
	console.log('Updating course',courseId);	
	console.log('course body',req.body);
	Courses.findOne({"name" : courseId}, 
		function (err, course) {			
			course.content = req.body.content;
			course.objetives = req.body.objetives;
			course.bibliography = req.body.bibliography;
			// course = req.body
			console.log('newcourse',course);
			course.save(function (err) {
				if(err) {
					console.error('ERROR!');
					res.send('error while updating')
				}
			res.end('Updated the course with id: ' + courseId);
			});
		}
	);		
};

var update_field1 = function(courseId,field,value){
	console.log('Updating course ',courseId);
	console.log('courseId,field',courseId,field);
	console.log('value\n',value);
	Courses.findOne({"name" : courseId}, 
		function (err, course) {
			console.log('course object',course);
			course[field] = value;
			console.log('new course body',course);
			course.save(function (err) {return err});
		}
	);
}

exports.update_course_field = function(courseId,field,value){
	console.log('calling update_field1');
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
		console.error('ERROR!');
		res.end('error while updating');
	}	
	res.end('Updated the course with id: ' + req.body.name);
			
}

















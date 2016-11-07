'use strict';

/*
This version works with the following exported functions.
listCourses: list all courses
listCourse: list the course specified by course_name. 
	If there are several courses with the same name,
	then all of them will be showed
insertCourse: insert the course received as parameter
deleteCourse: delete the course received as parameter
*/

var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	

// Exporting all function
// list all courses
exports.all = function (req, res) 
	{
	console.log(config)
    Courses.find({}, function (err, course) {
		if (err) res.sendStatus(err.code);
		res.json(course);
	});
};

// exports.prueba = function (req, res) 
	// {
		// var p1 = req.params.param1;
		// var p2 = req.params.param2;
	// console.log(p1);
	// console.log(p2);    
	// res.json("Parametros"+p1+p2);

// };


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

// Exporting update function
// update the course received as parameter
// the new course is received via the request body in JSON format
exports.update1 = function(req, res) {
	var courseId = req.body.name;
	
	console.log('Updating course',courseId);	
	console.log('course body',req.body);
	
	Courses.findOne({"name" : courseId}, 
		function (err, course) {
			console.log('course object',course);
			course[req.body.field] = req.body.value			
			course.save(function (err) {
				if(err) {
					console.error('ERROR!');
					res.send('error while updating')
				}
			});
			console.log('new course body',course);
			res.end('Updated the course with id: ' + courseId);
			});
}



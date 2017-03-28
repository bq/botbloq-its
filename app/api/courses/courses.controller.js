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
    CoursesFunctions = require('./courses.functions.js'),
    async = require('async'),
    mongoose = require('mongoose'),
    _ = require('lodash');
	

// Exporting all function
// list all courses
exports.all = function (req, res) 
	{
	// console.log(config)
    Courses.find({}, function (err, course) {
		CoursesFunctions.controlErrors(err, res, course);
	});
};

// Exporting get function
// list the course specified by its id
// If there are none with this id, then it returns an empty list []
exports.get = function (req, res){
	var courseId = req.params.id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
	        	console.log(err);
				res.status(err.code).send(err);				
			} else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				res.status(200).json(course); 
			} 			 
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting remove function
// delete the course received as parameter
// If the course does not exist in the database, 
// it considers the course removed anyway
exports.remove = function(req,res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
	    	if(!course){
				res.status(404).send('The course with id: ' + req.params.id + ' is not registrated');
			} else{
				Courses.remove({_id: course._id}, function (err, resp) {
			        CoursesFunctions.controlErrors(err, res, resp);
			    });
			}
	    }
	], function(err, course) {
	    if (err) {
	    	console.log(err);
			res.status(err.code).send(err);				
	    } else {
	    	res.sendStatus(200);
	    }
	});
};

/**
 * Destroys all elements
 */
exports.reset  = function(req, res){
    Courses.remove({}, function (err, resp) {
	    CoursesFunctions.controlErrors(err, res, resp);
    });
};

// Exporting create function
// insert the course received as parameter
exports.create = function(req, res) {
	var bool = false;
	if (req.body.name){
		Courses.find({}, function(err, courses) {
			if(err){
				console.log(err);
	        	res.status(err.code).send(err);
			} else {
				for(var i = 0; i< courses.length; i++){
					if(courses[i].name === req.body.name){
						bool = true;
					}
				}
				if(bool === false){
				    Courses.create(req.body, function (err, course) {
						if (err) {
							console.log(err);
							res.status(err.code).send(err);
						}
						console.log('Course created!');
						var idCse = course._id;
						res.writeHead(200, {
							'Content-Type': 'text/plain'
						});
						res.end('Added the course with id: ' + idCse);
					});
				} else {
					res.status(403).send('A course with the same name already exists');
				}
			}
		});
	} else {
		res.status(400).send('Course name is required');
	}
};

// Exporting update function
// update the course received as parameter
// the new course is received via the request body in JSON format
exports.update = function(req, res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
			if(req.body.name){
				Courses.findOne({name: req.body.name}, function(err, course2) {
					if(err){
						console.log(err);
			        	res.status(err.code).send(err);
					} else if(!course2){
						res.status(200);
					} else {
						if(course._id.equals(course2._id)){
							res.status(200);
						} else {
							res.status(400).send('A course with the same name already exists');
						}
					}
	
					if(res.statusCode === 200) {
						var newCourse = CoursesFunctions.doUpdate(course, req.body);
						course = _.extend(course, newCourse);
						course.save(next);						
					}
				});
			} else {
				res.status(200);
				var newCourse = CoursesFunctions.doUpdate(course, req.body);
				course = _.extend(course, newCourse);
				course.save(next);	
			}
	    }
	], function(err, course) {
	    CoursesFunctions.controlErrors(err, res, course);
	});		
};















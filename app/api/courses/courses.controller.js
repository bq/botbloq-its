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
		if (err) { res.sendStatus(err.code); }
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
	Courses.findOne({name: courseId}, function(err, course) {
        if (err) {
			res.sendStatus(err.code);				
		} else if(!course){
			res.status(404).send('The course with id: ' + courseId + ' is not registrated');
		} else {
			res.status(200).json(course); 
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
			Courses.remove(course, function (err, resp) {
		        if (err){
					res.status(404).send(err);
		        } else {
					res.json(resp);
				}
		    });
	    }
	], function(err, course) {
	    if (err) {
			res.sendStatus(err.code);				
	    } 
	});
};

/**
 * Destroys all elements
 */
exports.reset  = function(req, res){
    Courses.remove({}, function (err, resp) {
	    if (err){
	        res.status(404).send(err);
		} else {
			res.json(resp);
		}
    });
};

// Exporting create function
// insert the course received as parameter
exports.create = function(req, res) {
	var bool = false;
	if (req.body.name !== undefined){
		Courses.find({}, function(err, courses) {
			if(err){
	        	res.sendStatus(err.status);
			} else {
				for(var i = 0; i< courses.length; i++){
					if(courses[i].name === req.body.name){
						bool = true;
					}
				}
				if(bool === false){
				    Courses.create(req.body, function (err, course) {
						if (err) {res.sendStatus(err.code); }
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
			if(req.body.name !== undefined){
				Courses.find({}, function(err, courses) {
					if(err){
			        	res.sendStatus(err.status);
					} else {
						for(var i = 0; i< courses.length; i++){
							if(courses[i].name === req.body.name) {
								if(courses[i]._id.equals(course._id) === false){
									res.status(400);
								}	
							}
						}
						if(res.statusCode !== 400) {
							course = _.extend(course, req.body);
							course.save(next);	
							res.status(200);
						} else {
							res.status(400).send('A course with the same name already exists');
						}						
					}
				});
			} else {
				course = _.extend(course, req.body);
				course.save(next);	
				res.status(200);
			}
	    }
	], function(err, course) {
	    if (err) {
        	res.sendStatus(err.status);
	    } 
		else { 
			if(res.statusCode === 200){
				res.json(course); 
			}
		}
	});		
};

var update_field1 = function(courseId,field,value){
	Courses.findOne({name: courseId}, 
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
	if(req.body.field === 'name'){
		Courses.findOne({name: req.body.value}, function(err, course){
			if(err){
				 res.sendStatus(err);
			} else if (!course){
				Courses.findOne({'name' : req.body.name}, function (err1, course1) {
					if(err1){
						res.sendStatus(err1);
					}else if (!course1){
						res.status(404).send('The course with id: ' + req.body.name + ' is not registrated');
					} else {
						update_field1(req.body.name,req.body.field,req.body.value);
						res.status(200).send('Updated the course with id: ' + req.body.name);
					}
				});
			} else {
				res.status(400).send('The new name already exist in other course')
			}
		});
	} else {
		update_field1(req.body.name,req.body.field,req.body.value);
		res.status(200).send('Updated the course with id: ' + req.body.name);
	}			
}



















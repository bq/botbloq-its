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
exports.all = function (req, res) {
	console.log(config)
    Courses.find({}, function (err, course) {
        if (err) res.sendStatus(err.code);
        res.json(course);
    });
};


// Exporting get function
// list the course specified by id
// If there are several courses with the same name
// all of them will be showed
exports.get = function (req, res) {
    console.log(req.params.id)
    Courses.findById(req.params.id, function (err, course) {
       if (err) res.sendStatus(err.code);
        res.json(course);
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
exports.update = function(req,res) {		
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
	        course = _.extend(course, req.body);
	        course.save(next);
	    }
	], function(err, course) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!course) {
	            res.sendStatus(404);
	        } else {
	            res.json(course);
	        }
	    }
	});
	}
	
// Exporting remove function
// delete the course received as parameter
exports.remove = function(req,res) {	
	console.log(req.params.id);
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
			Courses.remove(course);
	    }
	], function(err, course) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!course) {
	            res.sendStatus(404);
	        } else {
	            res.json(course);
	        }
	    }
	});
};


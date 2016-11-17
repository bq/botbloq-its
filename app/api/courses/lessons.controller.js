'use strict';

/*
Lesson controller

This version works with the following exported functions.

*/

var OK200 = 200,
	Created201 = 201,
	NoContent204 = 204,
	NotFound404 = 404,
	Conflict409 = 409,
	ServerError500 = 500;

var Courses = require('./courses.model.js'),
	// Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
var CoursesFunctions = require('./courses.functions.js'),
	controller = require('./courses.controller.js');
	
// Exporting function all_lessons
// list all sections from a course
exports.all_lessons = function (req, res) 
	{	
	console.log("listing all lessons");
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	console.log("course_id",courseId);
	console.log("section_id",sectionId);
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(ServerError500).send(err);} 
		else if (course) 
			{ 
				console.log("course",course);
				var ind = CoursesFunctions.find_section(sectionId,course.sections);
				console.log("section position",ind);
				if (ind < 0){
					console.log("Error: section does not exists",sectionId);
					res.status(NotFound404).send("Error: section does not exists "+sectionId);
				}
				else {					
					console.log("course section",course.sections[ind].lessons);
					res.status(OK200).send(course.sections[ind].lessons);
				}			
			} 
			 else { res.status(NotFound404).send("Error: course does not exists "+courseId); }    
	});
};
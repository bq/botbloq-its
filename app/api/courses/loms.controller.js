'use strict';

/*
Learning Objects (LO) controller

This version works with the following exported functions.

	
*/

var OK200 = 200,
	Created201 = 201,
	NoContent204 = 204,
	NotFound404 = 404,
	Conflict409 = 409,
	ServerError500 = 500;

var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
var CoursesFunctions = require('./courses.functions.js'),
	controller = require('./courses.controller.js');
	
// Exporting function all_loms
// lists all loms from a lesson. 
// If the lesson, section or course doesn't exist, it sends an error message

exports.all_loms = function (req, res) 
	{	
	console.log("listing all loms");
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	console.log("course_id",courseId);
	console.log("section_id",sectionId);
	console.log("lesson_id",lessonId);
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(ServerError500).send(err);} 
		else if (course) 
			{ // course exists
				console.log("course found");
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				console.log("section position",inds);
				if (inds < 0){
					console.log("Error: section does not exists",sectionId);
					res.status(NotFound404).send("Error: section does not exists "+sectionId);
				}
				else { // section exists
					console.log("section exists");
					var indl = CoursesFunctions.find_section(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						console.log("Error: lesson does not exists",lessonId);
						res.status(NotFound404).send("Error: lesson does not exists "+lessonId);
					}
					else {
						var lesson = course.sections[inds].lessons[indl];
						console.log("lesson",lesson);
						res.status(OK200).send(lesson.los);
					}
				}			
			} 
			 else { res.status(NotFound404).send("Error: course does not exists "+courseId); }    
	});
};
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
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(ServerError500).send(err);} 
		else if (course) 
			{ // course exists
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					console.log("Error: section does not exists",sectionId);
					res.status(NotFound404).send("Error: section does not exists "+sectionId);
				}
				else { // section exists
					var indl = CoursesFunctions.find_section(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						console.log("Error: lesson does not exists",lessonId);
						res.status(NotFound404).send("Error: lesson does not exists "+lessonId);
					}
					else {
						var lesson = course.sections[inds].lessons[indl];
						res.status(OK200).send(lesson.los);
					}
				}			
			} 
			 else { res.status(NotFound404).send("Error: course does not exists "+courseId); }    
	});
};

// Exporting function get_lom
// lists the indicated lom from a lesson. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lom = function (req, res) 
	{	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	var lomId = req.params.lom_id;
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(ServerError500).send(err);} 
		else if (course) 
			{ // course exists
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					console.log("Error: section does not exists",sectionId);
					res.status(NotFound404).send("Error: section does not exists "+sectionId);
				}
				else { // section exists
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						console.log("Error: lesson does not exists",lessonId);
						res.status(NotFound404).send("Error: lesson does not exists "+lessonId);
					}
					else { // lesson exists					
						var lesson = course.sections[inds].lessons[indl];
						var ind = CoursesFunctions.find_lom(lomId,lesson.los);
						if (ind < 0) {
						console.log("Error: lom does not exists",lomId);
						res.status(NotFound404).send("Error: lom does not exists "+lomId);
						}
						else { //lom exists
							res.status(OK200).send(lesson.los[ind]);
						}
					}			
				} 			 
			}
			else { res.status(NotFound404).send("Error: course does not exists "+courseId); }    
		});
};


// Exporting assign_lom function
// It receives as the body of the request in JSON format
// the name of the course, section, and lesson where the new lom should be created  
// and the lom_id to be created 
// It verifies if the course, section, and lesson exist. 
// If lom already exist, it sets an error
// If lom doesn't exist previously, it creates the new lom
// Example: 
// {
	// "course":"Course1",
	// "section":"Section2",
	// "lesson":"Lesson1.2.3",
	// "lom_id": "lom1.2.3.1"
// }

exports.assign_lom = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		lom_id = req.body.lom_id;
		
	
	Courses.findOne({"name" : courseId}, 
		function (err, course){
			if (err) { res.status(ServerError500).send(err);} 
			else if ( !course ) { res.status(NotFound404).send("Error: course does not exists "+courseId); }
				else {
					var inds = CoursesFunctions.find_section(sectionId,course.sections);
					if (inds < 0){
						console.log("Error: section does not exists ",sectionId);
						res.status(NotFound404).send("Error: section does not exists "+sectionId);
					}
					else {					
						var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
						if ( indl < 0 ){
							console.error('error lesson does not exist ',lessonId);
							res.end('error lesson does not exist '+lessonId);
						}
						else {
							var lessons = course.sections[inds].lessons;							
							var ind = CoursesFunctions.find_lom(lom_id,lessons[indl].loms);
							if ( !(ind < 0)){
								console.error('error lom already exist ',lom_id);
								res.end('error lom already exist '+lom_id);
							}
							else {
								var loms = lessons[indl].loms;
								loms[loms.length] = {"lom_id":lom_id};
								var err1 = controller.update_course_field(courseId,"sections",course.sections);
								if (err1) {
									console.error('error while updating '+err);
									res.end('error while updating '+err)
									}							
								else res.status(OK200).send(course.sections[inds].lessons);
							}
						}
					}	
				}
		}
	);
}

// Exporting delete_lom function
// It receives as the body of the request in JSON format
// the name of the course, section, lesson, and the lom to be deleted  
// It verifies if the course, section, lesson, and lom exist.
// If the course, section, or lesson does not exist, it sends an error message
// If lom does not exist, it considers the lom deleted (i.e. not an error) 
// Example: 
// {
	// "course":"Course1",
	// "section":"Section2",
	// "lesson":"Lesson1.2.3",
	// "lom_id": "lom1.2.3.1"
// }

exports.delete_lom = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		lom_id = req.body.lom_id;
		
	
	Courses.findOne({"name" : courseId}, 
		function (err, course){
			if (err) { res.status(ServerError500).send(err);} 
			else if ( !course ) { res.status(NotFound404).send("Error: course does not exists "+courseId); }
				else {
					var inds = CoursesFunctions.find_section(sectionId,course.sections);
					if (inds < 0){
						console.log("Error: section does not exists ",sectionId);
						res.status(NotFound404).send("Error: section does not exists "+sectionId);
					}
					else {					
						var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
						if ( indl < 0 ){
							console.error('error lesson does not exist ',lessonId);
							res.end('error lesson does not exist '+lessonId);
						}
						else {
							var lessons = course.sections[inds].lessons;							
							var ind = CoursesFunctions.find_lom(lom_id,lessons[indl].los);
							if ( (ind < 0)){
								console.error('error lom does not exists ',lom_id);
								res.end('error lom does not exists '+lom_id);
							}
							else {
								var loms = lessons[indl].los;
								loms.splice(ind,1);
								var err1 = controller.update_course_field(courseId,"sections",course.sections);
								if (err1) {
									console.error('error while updating '+err);
									res.end('error while updating '+err)
									}							
								else res.status(OK200).send(course.sections[inds].lessons);
							}
						}
					}	
				}
		}
	);
}
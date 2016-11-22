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

// Exporting function get_lom
// lists the indicated lom from a lesson. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lom = function (req, res) 
	{	
	console.log("listing a particular loms");
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	var lomId = req.params.lom_id;
	console.log("course_id",courseId);
	console.log("section_id",sectionId);
	console.log("lesson_id",lessonId);
	console.log("lom_id",lomId);
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
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						console.log("Error: lesson does not exists",lessonId);
						res.status(NotFound404).send("Error: lesson does not exists "+lessonId);
					}
					else { // lesson exists					
						console.log("lesson exists");
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


// Exporting create_lom function
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

exports.create_lom = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		lom_id = req.body.lom_id;
		
	console.log('Creating lom ',lom_id,' in lesson ',lessonId,' of section ',sectionId,' of course ',courseId);	
	
	Courses.findOne({"name" : courseId}, 
		function (err, course){
			if (err) { res.status(ServerError500).send(err);} 
			else if ( !course ) { res.status(NotFound404).send("Error: course does not exists "+courseId); }
				else {
					console.log('old course object',course);				
					var inds = CoursesFunctions.find_section(sectionId,course.sections);
					console.log("section position",inds);
					if (inds < 0){
						console.log("Error: section does not exists ",sectionId);
						res.status(NotFound404).send("Error: section does not exists "+sectionId);
					}
					else {					
						console.log("course section lessons",course.sections[inds].lessons);
						var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
						console.log("lesson position",indl);
						if ( indl < 0 ){
							console.error('error lesson does not exist ',lessonId);
							res.end('error lesson does not exist '+lessonId);
						}
						else {
							console.log('lesson exist ',lessonId);
							var lessons = course.sections[inds].lessons;							
							var ind = CoursesFunctions.find_lom(lom_id,lessons[indl].los);
							if ( !(ind < 0)){
								console.error('error lom already exist ',lom_id);
								res.end('error lom already exist '+lom_id);
							}
							else {
								console.log('lom does not exist ',lom_id);
								var loms = lessons[indl].los;
								loms[loms.length] = {"lom_id":lom_id};
								console.log('new loms',loms);
								console.log('calling update_course_field');
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
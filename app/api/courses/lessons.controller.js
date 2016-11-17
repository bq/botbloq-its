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
// lists all lessons from a course section. 
// If the course or the section doesn't exist, it sends an error message

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

// Exporting create_lesson function
// It receives as the body of the request in JSON format
// the name of the course and the section where the new lesson should be created and 
// the name of the lesson to be created and its information
// It verifies if the lesson already exist, in which case, it sets an error
// If lesson doesn't exist previously, it creates the new lesson
// Example: 
// {
	// "course":"Course1",
	// "section":"Section2",
	// "lesson":{  
    		// "name": "Lesson1.2.3",
       		// "resume": "Lesson1.2.3 resume",
       		// "los": [] 
	  // }
// }

exports.create_lesson = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		new_lec = req.body.lesson,
		lessonId = new_lec.name;
		
	console.log('Creating lesson ',lessonId,'in section ',sectionId,'of course ',courseId);	
	console.log('lesson body',new_lec);	
	
	Courses.findOne({"name" : courseId}, 
		function (err, course){
			if (err) { res.status(ServerError500).send(err);} 
			else if ( !course ) { res.status(NotFound404).send("Error: course does not exists "+courseId); }
				else {
					console.log('old course object',course);				
					var inds = CoursesFunctions.find_section(sectionId,course.sections);
					console.log("section position",inds);
					if (inds < 0){
						console.log("Error: section does not exists",sectionId);
						res.status(NotFound404).send("Error: section does not exists "+sectionId);
					}
					else {					
						console.log("course section lessons",course.sections[inds].lessons);
						var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
						console.log("lesson position",indl);
						if ( !(indl < 0) ){
							console.error('error lesson already exist');
							res.end('error lesson already exist');
						}
						else {
							console.log('lesson does not exist previously');
							var lessons = course.sections[inds].lessons;
							lessons[lessons.length] = new_lec;
							console.log('new lessons',lessons);
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
	);
}
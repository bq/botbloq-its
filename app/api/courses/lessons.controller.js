'use strict';

/*
Lesson controller

This version works with the following exported functions.

*/

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

exports.all_lessons = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err)
			res.status(500).send(err);
		else{
			if (!course)
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			else{
				var ind = CoursesFunctions.find_section(sectionId,course.sections);
				if (ind < 0)
					res.status(404).send('Error: section does not exists '+sectionId);
				else					
					res.status(200).send(course.sections[ind].lessons);			
			} 			
		}   
	});
};

// Exporting function get_lesson
// lists the indicated lesson from a course section. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lesson = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err)
			res.status(500).send(err); 
		else{
			if (!course)
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			else { 
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0)
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				else {	// section exists
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0)
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					else
						res.status(200).send(course.sections[inds].lessons[indl]);		
				}    
			}
		}
	});
};

// Exporting function delete_lesson
// delete the indicated lesson from a course section. 
// If lesson does not exist, it considers the section deleted (i.e. not an error)
// If the course or the section doesn't exist, it sends an error message

exports.delete_lesson = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err)
			res.status(500).send(err);
		else{
			if (!course)
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			else{ 
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0)
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				else {	// section exists
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 )
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					else {
						course.sections[inds].lessons.splice(indl,1);
						var err1 = controller.update_course_field(courseId,'sections',course.sections);
						if (err1)
							res.status(400).send('error while updating '+err)
						else
							res.status(200).send('Updated the course with id: ' + JSON.stringify(course));
					}			
				}    
			}
		}
	});
};

// Exporting create_lesson function
// It receives as the body of the request in JSON format
// the name of the course and the section where the new lesson should be created and 
// the name of the lesson to be created and its information
// It verifies if section and course exist. 
// If lesson already exist, it sets an error
// If lesson doesn't exist previously, it creates the new lesson
// Example: 
// {
	// 'course':'Course1',
	// 'section':'Section2',
	// 'lesson':{  
    		// 'name': 'Lesson1.2.3',
       		// 'resume': 'Lesson1.2.3 resume',
       		// 'los': [] 
	  // }
// }

exports.create_lesson = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		new_lec = req.body.lesson,
		lessonId = new_lec.name;
		
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err)
			res.status(500).send(err);
		else{
			if (!course)
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			else {
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0)
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				else {					
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if ( !(indl < 0) )
						res.status(400).send('error lesson already exist');
					else {
						var lessons = course.sections[inds].lessons;
						lessons[lessons.length] = new_lec;
						var err1 = controller.update_course_field(courseId,'sections',course.sections);
						if (err1)
							res.status(400).send('error while updating '+err)
						else res.status(200).send(new_lec);
					}
				}	
			}
		}
	});
}

// Exporting update_lesson function
// It receives as the body of the request in JSON format
// the name of the course and the section where the lesson should be updated and 
// the name of the lesson to be updated and its information
// It verifies if section and course exist. 
// If lesson already exist, it updates the lesson
// If lesson doesn't exist previously, it sets an error
// Example: 
// {
	// 'course':'Course1',
	// 'section':'Section2',
	// 'lesson':{  
    		// 'name': 'Lesson1.2.3',
       		// 'resume': 'Lesson1.2.3 resume',
       		// 'los': [] 
	  // }
// }

exports.update_lesson = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		new_lec = req.body.lesson,
		lessonId = new_lec.name;
			
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err)
			res.status(500).send(err);
		else{
			if (!course)
				 res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			else {
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0)
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				else {					
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 )
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					else {
						var lessons = course.sections[inds].lessons;
						lessons.splice(indl,1);
						lessons[lessons.length] = new_lec;
						var err1 = controller.update_course_field(courseId,'sections',course.sections);
						if (err1) 
							res.status(404).send('error while updating '+err);							
						else
							res.status(200).send(course.sections[inds].lessons);
					}
				}	
			}
		}
	});
};

// Exporting update_lesson_field function
// It receives as the body of the request in JSON format
// the names of the course, the section, the lesson and the field and 
// the new value of the field 
// Example: 
// { 
    // 'course': 'Course1',
    // 'section': 'Section1.1',
	// 'lesson': 'Lesson1.1.1',
    // 'field':'resume',
    // 'value': 'Lesson1.1.1 new resume'
  // }

exports.update_lesson_field = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		field = req.body.field,
		value = req.body.value;
		
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err)
			res.status(500).send(err); 
		else{ 
			if (!course)
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			else {
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0)
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				else {					
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 )
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					else {
						var lessons = course.sections[inds].lessons,
							lesson = lessons[indl];
						lessons.splice(indl,1);
						lesson[field] = value;
						lessons[lessons.length] = lesson;
						var err1 = controller.update_course_field(courseId,'sections',course.sections);
						if (err1)
							res.status(400).send('error while updating '+err);							
						else
							res.status(200).send(course.sections[inds].lessons);
					}
				}	
			}
		}
	});
};
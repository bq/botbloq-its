'use strict';

/*
Learning Objects (LO) controller

This version works with the following exported functions.

	
*/
var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	
var CoursesFunctions = require('./courses.functions.js'),
	controller = require('./courses.controller.js'),
	LOMS = require('../loms/loms.model.js');
	
	
// Exporting function all_loms
// lists all loms from a lesson. 
// If the lesson, section or course doesn't exist, it sends an error message

exports.all_loms = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err){
			res.status(500).send(err);
		} else{
			if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			}else{
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				}else { // section exists
					var indl = CoursesFunctions.find_section(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {
						var lesson = course.sections[inds].lessons[indl];
						res.status(200).send(lesson.loms);
					}
				}			
			} 
		}
	});
};

// Exporting function get_lom
// lists the indicated lom from a lesson. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lom = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	var lomId = req.params.lom_id;
	
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err){
			res.status(500).send(err); 
		} else{
			if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			} else { // course exists
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else { // section exists
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else { // lesson exists					
						var lesson = course.sections[inds].lessons[indl];
						var ind = CoursesFunctions.find_lom(lomId,lesson.los);
						if (ind < 0){
							res.status(404).send('The lom with id : ' + lomId +
							' has not been found un the lesson with id: ' + lessonId);
						} else {//lom exists
							res.status(200).send(lesson.los[ind]);
						}
					}			
				} 			 
			}
		}
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
	// 'course':'Course1',
	// 'section':'Section2',
	// 'lesson':'Lesson1.2.3',
	// 'lom_id': 'lom1.2.3.1'
// }

exports.assign_lom = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		lomId = req.body.lom_id;
		
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err){
			res.status(500).send(err);
		} else{
			if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {
						var lessons = course.sections[inds].lessons;							
						var ind = CoursesFunctions.find_lom(lomId,lessons[indl].loms);
						if ( !(ind < 0)){
							res.status(400).send('error lom already exist '+lomId);
						} else {
							LOMS.find({_id: lomId}, function(err, lom){
								if(err){
									res.senStatus(err.code).send(err);
								}else {
									if(lom.length = 0){
										res.sendStatus(404).send('The lom with id: ' + lomId + ' is not registrated');
									} else {
										var loms = lessons[indl].loms;
										loms[loms.length] = {'lom_id':lomId};
										var err1 = controller.update_course_field(courseId,'sections',course.sections);
										if (err1){
											res.status(400).send('error while updating '+err);							
										} else {
											res.status(200).send(course.sections[inds].lessons);
										}
									}
								}	
							});
						}
					}
				}	
			}
		}	
	});
};

// Exporting delete_lom function
// It receives as the body of the request in JSON format
// the name of the course, section, lesson, and the lom to be deleted  
// It verifies if the course, section, lesson, and lom exist.
// If the course, section, or lesson does not exist, it sends an error message
// If lom does not exist, it considers the lom deleted (i.e. not an error) 
// Example: 
// {
	// 'course':'Course1',
	// 'section':'Section2',
	// 'lesson':'Lesson1.2.3',
	// 'lom_id': 'lom1.2.3.1'
// }

exports.delete_lom = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		lessonId = req.body.lesson,
		lomId = req.body.lom_id;
		
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err){
			res.status(500).send(err);
		} else{
			if (!course){ 
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var inds = CoursesFunctions.find_section(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.find_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {
						var lessons = course.sections[inds].lessons;							
						var ind = CoursesFunctions.find_lom(lomId,lessons[indl].los);
						if (ind < 0){
							res.status(404).send('The lom with id : ' + lomId +
							' has not been found un the lesson with id: ' + lessonId);
						} else {
							var loms = lessons[indl].loms;
							loms.splice(ind,1);
							var err1 = controller.update_course_field(courseId,'sections',course.sections);
							if (err1){
								res.status(400).send('error while updating '+err);							
							} else {
								res.status(200).send(course.sections[inds].lessons);
							}
						}
					}
				}	
			}
		}
	});
};
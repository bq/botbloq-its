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
	mongoose = require('mongoose'),
	controller = require('./courses.controller.js');
	
// Exporting function all_lessons
// lists all lessons from a course section. 
// If the course or the section doesn't exist, it sends an error message

exports.all_lessons = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err){
	        	console.log(err);
				res.status(err.code).send(err);
			} else if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			} else{
				var ind = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (ind < 0){ 
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {				
					res.status(200).send(course.sections[ind].lessons);	
				}					
			}   
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};

// Exporting function get_lesson
// lists the indicated lesson from a course section. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lesson = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err){
	        	console.log(err);
				res.status(err.code).send(err); 
			} else if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
			} else { 
				var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {	// section exists
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {
						res.status(200).send(course.sections[inds].lessons[indl]);	
					}	
				}    
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};

// Exporting function delete_lesson
// delete the indicated lesson from a course section. 
// If lesson does not exist, it considers the section deleted (i.e. not an error)
// If the course or the section doesn't exist, it sends an error message

exports.delete_lesson = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
	        	console.log(err);
				res.status(err.code).send(err);
			} else if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else{ 
				var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0) {
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {	// section exists
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {
						course.sections[inds].lessons.splice(indl,1);

						if (res.statusCode !== 200){
							res.status(400).send('error while updating '+err)
						} else {
							res.status(200).send({ok:1, n: 1});
						}
						course.save();
					}			
				}    
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting create_lesson function
// It receives as the body of the request in JSON format
// the information of the lesson
// It verifies if section and course exist. 
// If lesson already exist, it sets an error
// If lesson doesn't exist previously, it creates the new lesson

exports.create_lesson = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		new_lec = req.body,
		lessonId = new_lec.name;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				console.log(err);
				res.status(err.code).send(err);
			} else if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl >= 0 ){
						res.status(400).send('Error lesson already exist');
					} else {
						var lessons = course.sections[inds].lessons;
						lessons.push(new_lec);
						
						if (res.statusCode !== 200){
							res.status(400).send('error while updating '+err);
						} else { 
							res.status(200).send(lessons[lessons.length-1]); 
						}
						course.save();
					}
				}	
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
}

// Exporting update_lesson function
// It receives as the body of the request in JSON format
// the information of the lesson to update
// It verifies if section and course exist. 
// If lesson already exist, it updates the lesson
// If lesson doesn't exist previously, it sets an error

exports.update_lesson = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		new_lec = req.body,
		lessonId = new_lec.name;
	if(mongoose.Types.ObjectId.isValid(courseId)){	
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				console.log(err);
				res.status(err.code).send(err);
			} else if (!course) {
				 res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found un the section with id: ' + sectionId);
					} else {

						var lessons = course.sections[inds].lessons;
						lessons[indl] = CoursesFunctions.doUpdate(lessons[indl] , new_lec);

						if (res.statusCode !== 200) {
							res.status(404).send('error while updating '+err);							
						} else {
							res.status(200).send(lessons[lessons.length-1]);
						}
						course.save();
					}
				}	
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

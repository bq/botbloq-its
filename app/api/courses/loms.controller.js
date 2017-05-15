 'use strict';

/*
Learning Objects (LO) controller

This version works with the following exported functions.

	
*/
var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash'),
	mongoose = require('mongoose');
	
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
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err){
	        	console.log(err);
				res.status(err.code).send(err);
			} else{
				if (!course){
					res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
				}else{
					var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
					if (inds < 0){
						res.status(404).send('The section with id : ' + sectionId +
						' has not been found in the course with id: ' + courseId);
					}else { // section exists
						var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
						if (indl < 0) {
							res.status(404).send('The lesson with id : ' + lessonId +
							' has not been found in the section with id: ' + sectionId);
						} else {
							var lesson = course.sections[inds].lessons[indl];
							res.status(200).send(lesson.loms);
						}
					}			
				} 
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};

// Exporting function get_lom
// lists the indicated lom from a lesson. 
// If some of them i.e. course, section or lesson doesn't exist, it sends an error message

exports.get_lom = function (req, res) {	
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	var lessonId = req.params.lesson_id;
	var lomId = req.params.lom_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err){
	        	console.log(err);
				res.status(err.code).send(err); 
			} else{
				if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
				} else { // course exists
					var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
					if (inds < 0){
						res.status(404).send('The section with id : ' + sectionId +
						' has not been found in the course with id: ' + courseId);
					} else { // section exists
						var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
						if (indl < 0){
							res.status(404).send('The lesson with id : ' + lessonId +
							' has not been found in the section with id: ' + sectionId);
						} else { // lesson exists					
							var lesson = course.sections[inds].lessons[indl];
							var ind = CoursesFunctions.find_lom(lomId,lesson.loms);
							if (ind < 0){
								res.status(404).send('The lom with id : ' + lomId +
								' has not been found in the lesson with id: ' + lessonId);
							} else {//lom exists
								res.status(200).send(lesson.loms[ind]);
							}
						}			
					} 			 
				}
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};


// Exporting assign_lom function
// It verifies if the course, section, and lesson exist. 
// If lom already exist, it sets an error
// If lom doesn't exist previously, it creates the new lom


exports.assign_lom = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		lessonId = req.params.idle,
		lomId = req.params.idlo;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				console.log(err);
				res.status(err.code).send(err);
			} else{
				if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated');
				} else {
					var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
					if (inds < 0){
						res.status(404).send('The section with id : ' + sectionId +
						' has not been found in the course with id: ' + courseId);
					} else {					
						var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
						if ( indl < 0 ){
							res.status(404).send('The lesson with id : ' + lessonId +
							' has not been found in the section with id: ' + sectionId);
						} else {
							var lessons = course.sections[inds].lessons;							
							var ind = CoursesFunctions.find_lom(lomId,lessons[indl].loms);
							if ( ind >= 0){
								res.status(400).send('Error LOM already assigned in the lesson');
							} else {
								if(mongoose.Types.ObjectId.isValid(lomId)){
									LOMS.findOne({_id: lomId}, function(err, lom){
										if(err){
											console.log(err);
											res.status(err.code).send(err);
										} else if(!lom){
											res.status(404).send('The lom with id: ' + lomId + ' is not registrated');
										} else {
											var loms = lessons[indl].loms;

											var typeLOM = CoursesFunctions.translateFormat(lom.technical.format);
											loms[loms.length] = {lom_id: lomId, type: typeLOM};

											if (res.statusCode !== 200){
												res.status(400).send('error while updating '+err);							
											} else {
												res.status(200).send(loms[loms.length-1]);
											}
											course.save();
										}	
									});
								} else {
									res.status(404).send('The lom with id: ' + lomId + ' is not registrated');
								}
								
							}
						}
					}	
				}
			}	
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting assign_loms function
// It verifies if the course, section, and lesson exist. 
// If loms already exist, it sets an error
// If loms doesn't exist previously, it assign the news loms


exports.assign_loms = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		lessonId = req.params.idle,
		newLoms = req.body;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				console.log(err);
				res.status(err.code).send(err);
			} else{
				if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated');
				} else {
					var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
					if (inds < 0){
						res.status(404).send('The section with id : ' + sectionId +
						' has not been found in the course with id: ' + courseId);
					} else {					
						var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
						if ( indl < 0 ){
							res.status(404).send('The lesson with id : ' + lessonId +
							' has not been found in the section with id: ' + sectionId);
						} else {
							var lessons = course.sections[inds].lessons;

							LOMS.find({_id: { $in: newLoms }}, function(err, loms){
								if(err){
									console.log(err);
									res.status(err.code).send(err);
								} else if(!loms){
									res.status(404).send('The loms with id: ' + newLoms + ' is not registrated');
								} else {

									var allLoms = lessons[indl].loms;

									_.forEach(loms, function(value){
										var typeLOM = CoursesFunctions.translateFormat(value.technical.format);

										allLoms.push({lom_id: value._id, type: typeLOM});
									});	
									// TODO hacer funcion para traducir format a tipo

									if (res.statusCode !== 200){
										res.status(400).send('error while updating '+err);							
									} else {
										res.status(200).send(allLoms);
									}
									course.save();
								}	
							});
						}
					}	
				}
			}	
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting delete_lom function 
// It verifies if the course, section, lesson, and lom exist.
// If the course, section, or lesson does not exist, it sends an error message
// If lom does not exist, it considers the lom deleted (i.e. not an error) 


exports.delete_lom = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		lessonId = req.params.idle,
		lomId = req.params.idlo;
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
					' has not been found in the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						var lessons = course.sections[inds].lessons;							
						var ind = CoursesFunctions.find_lom(lomId,lessons[indl].loms);
						if (ind < 0){
							res.status(404).send('The lom with id : ' + lomId +
							' has not been found in the lesson with id: ' + lessonId);
						} else {
							var loms = lessons[indl].loms;
							loms.splice(ind,1);

							if (res.statusCode !== 200){
								res.status(400).send('error while updating '+err);							
							} else {
								res.status(200).send({ok: 1, n: 1});
							}
							course.save();
						}
					}
				}	
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};
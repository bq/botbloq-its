 'use strict';
 /* jshint node: true */


var Courses = require('./courses.model.js'),
    _ = require('lodash'),
	mongoose = require('mongoose');
	
var CoursesFunctions = require('./courses.functions.js'),
	LOMS = require('../loms/loms.model.js');

/**
 *	List of requests:
 *
 *	- all_loms: 				Lists all LOMs from a lesson, section and a course.
 *
 * 	- get_lom: 					Lists the indicated LOM from a lesson, section and a course.
 *
 * 	- assign_lom: 				Assigns a LOM in a lesson from a section and a course.
 *
 *	- assign_loms: 				Assigns a LOM list in a lesson from a section and a course.
 *
 * 	- delete_lom: 				Deletes a LOM from a lesson, section and a course.
 *
 * 	- delete_loms: 				Deletes a LOM list from a lesson, section and a course.
 */


	
	
/**
 *	Lists all LOMs from a lesson, section and a course
 */
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

/**
 *	Lists the indicated LOM from a lesson, section and a course
 */
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


/**
 *	Assigns a LOM in a lesson from a section and a course.
 */
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

/**
 *	Assigns a LOM list in a lesson from a section and a course.
 */
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

/**
 *	Deletes a LOM from a lesson, section and a course.
 */
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

/**
 *	Deletes a LOM list from a lesson, section and a course.
 */
exports.delete_loms = function(req, res) {	
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
										console.log('eeeeeee: ' + value);
										var ind = CoursesFunctions.find_lom(value._id, allLoms);
										console.log('oooo:' + ind);
										allLoms.splice(ind,1);
									});	

									if (res.statusCode !== 200){
										res.status(400).send('error while updating '+err);							
									} else {
										res.status(200).send({ok: 1, n: loms.length});
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


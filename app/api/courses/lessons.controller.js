'use strict';


var Courses = require('./courses.model.js'),
	// Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    fs = require('fs'), 
    _ = require('lodash');
var CoursesFunctions = require('./courses.functions.js'),
	mongoose = require('mongoose'),
	controller = require('./courses.controller.js');

/**
 *	List of requests:
 *
 * 	- all_lessons: 					List all lessons from a course.
 *
 * 	- get_lesson: 					Lists the indicated lesson from a section and a course.
 *
 * 	- create_lesson: 				Creates a new lesson in a section of a course.
 *
 * 	- update_lesson: 				Updates a lesson from a section and a course.
 *
 * 	- delete_lesson: 				Deletes a leson from a section and a course.
 *
 * 	- get_lessonObjectives: 		Lists the indicated lesson objectives from a section and a course.
 * 
 * 	- includePhoto:  				Include photo in a lesson.
 */
	
/**
 *	List all lessons from a course
 */
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
					' has not been found in the course with id: ' + courseId);
				} else {				
					res.status(200).send(course.sections[ind].lessons);	
				}					
			}   
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};

/**
 *	Lists the indicated lesson from a section and a course
 */
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
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
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

/**
 *	Creates a new lesson in a section of a course.
 */
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
				if (inds === -1){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl !== -1 ){
						res.status(400).send('Error lesson already exist');
					} else {
						var lessons = course.sections[inds].lessons;
						
						lessons.push(new_lec);
						res.status(200).send(lessons[lessons.length-1]); 
						course.save();
					}
				}	
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
}

/**
 *	Updates a lesson from a section and a course.
 */
exports.update_lesson = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		new_lec = req.body,
		lessonId = req.params.idl;
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
					' has not been found in the course with id: ' + courseId);
				} else {					
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
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

/**
 *	Deletes a leson from a section and a course.
 */
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
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
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


/**
 *	Lists the indicated lesson objectives from a section and a course.
 */
exports.get_lessonObjectives = function (req, res) {	
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
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						res.status(200).send(course.sections[inds].lessons[indl].objectives);	
					}	
				}    
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};

/**
 * Include photo in a lesson.
 */
exports.includePhoto =  function (req, res) {
	var sectionId = req.params.ids, lessonId = req.params.idl;
	Courses.findOne({_id: req.params.idc}, function(err, course){
		if(!course) { 
			res.status(404).send('The course with id: '+  req.params.idc +' is not registrated');
		} else {
			var inds = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
			if (inds < 0){
				res.status(404).send('The section with id : ' + sectionId +
				' has not been found in the course with id: ' + courseId);
			} else {	// section exists
				var indl = CoursesFunctions.exist_section_lesson(lessonId,course.sections[inds].lessons);
				if (indl < 0) {
					res.status(404).send('The lesson with id : ' + lessonId +
					' has not been found in the section with id: ' + sectionId);
				} else {
					fs.stat(__dirname + '/../../res/files/photos/' + lessonId, function(err, stats){
						if(err) { fs.mkdir(__dirname + '/../../res/files/photos/' + lessonId); }
					});
					var file = __dirname + '/../../res/files/photos/' + lessonId + '/' + req.file.originalname;
					course.sections[inds].lessons[indl].photo = file;
					fs.readFile( req.file.path, function (err, data) {
						if(!data) {res.status(400).send('No data to upload');
						} else {
							fs.writeFile(file, data, function (err) {
								if( err ){
									console.error( err );
							        res.status(404).send(err);
								    res.end('Sorry, the photo: '+  req.file.originalname + 
									' couldn\'t be uploaded in the lesson with id: ' + lessonId);

								}else{
								    res.end('Photo: '+  req.file.originalname + 
									' uploaded successfully in the lesson with id: ' + lessonId);
								}
							});
						}
					});

				}
			}	


			
			course.save();
		}
			 
	});
};

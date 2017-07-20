'use strict';
/* jshint node: true */

var Courses = require('./courses.model.js'),
    async = require('async'),
    fs = require('fs'), 
    _ = require('lodash');
var functions = require('./courses.functions.js'),
	mongoose = require('mongoose');

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
				res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
			} else{
				var ind = functions.exist_section_lesson(sectionId,course.sections);
				if (ind < 0){ 
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {				
					res.status(200).send(course.sections[ind].lessons);	
				}					
			}   
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
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
				res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
			} else { 
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
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
		res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
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
				res.status(404).send('The course with id: ' + courseId + ' is not registered');
			} else {
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds === -1){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {					
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
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
		res.status(404).send('The course with id: ' + courseId + ' is not registered');
	}
};

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
				 res.status(404).send('The course with id: ' + courseId + ' is not registered');
			} else {
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {					
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {

						var lessons = course.sections[inds].lessons;
						lessons[indl] = functions.doUpdate(lessons[indl] , new_lec);

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
		res.status(404).send('The course with id: ' + courseId + ' is not registered');
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
				res.status(404).send('The course with id: ' + courseId + ' is not registered');
			} else{ 
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0) {
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if ( indl < 0 ){
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						course.sections[inds].lessons.splice(indl,1);

						if (res.statusCode !== 200){
							res.status(400).send('error while updating '+err);
						} else {
							res.status(200).send({ok:1, n: 1});
						}
						course.save();
					}			
				}    
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registered');
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
				res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
			} else { 
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
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
		res.status(404).send('The course with id: ' + courseId + ' is not registered'); 
	}
};

/**
 * Include photo in a lesson.
 */
exports.includePhoto =  function (req, res) {
	var courseId = req.params.idc, sectionId = req.params.ids, lessonId = req.params.idl, inds, indl;

	async.waterfall([
	    Courses.findById.bind(Courses, courseId),
	    function(course, next) {
			if(!course) { 
				res.status(404).send('The course with id: '+  courseId +' is not registered');
			} else {
				inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						// convert image to base64 encoded string
						var base64str = functions.base64_encode(req.file.path);

						course.sections[inds].lessons[indl].photo = base64str;
						// convert base64 string back to image 
						//base64_decode(base64str, 'copy.jpg');
						course.save(next);

					}
				}
			}
		}
	], function(err, course) {
	    functions.controlErrors(err, res, course.sections[inds].lessons[indl]);
	});
};

/**
 *	Return the base64 photo
 */
exports.getPhoto = function(req, res) {
	var courseId = req.params.course_id, sectionId = req.params.section_id, lessonId = req.params.lesson_id, ret;
	async.waterfall([
	    Courses.findById.bind(Courses, courseId),
	    function(course, next) {
	    	if(!course) { 
				res.status(404).send('The course with id: '+  courseId +' is not registered');
			} else {
				var inds = functions.exist_section_lesson(sectionId,course.sections);
				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {	// section exists
					var indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
				    	if(course.sections[inds].lessons[indl].photo){
				    		res.status(200);
				    		ret = course.sections[inds].lessons[indl].photo;
				    	} else {
				    		res.status(400);
				    		ret = 'course does not have a photo';
				    	}
				    	course.save(next);
				    }
				}
			}

	    }], function(err) {
		if(err){
			console.error(err);
			res.status(404).send(err);
		} else {
			res.send(ret);
		}
	});
}


/**
 *	Includes objectives in a lesson of a section and a course.
 */
exports.includeObjectives = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		lessonId = req.params.idl,
		inds = 0,
		indl = 0,
		new_obj = req.body,
		bool = true;
	async.waterfall([
   	 	Courses.findById.bind(Courses, courseId),
    	function(course, next) {
			if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registered');
			} else {
				inds = functions.exist_section_lesson(sectionId,course.sections);

				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {
					indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						var objectives = course.sections[inds].lessons[indl].objectives;
						
						_.forEach(new_obj, function(key){
							objectives.find(function(element){
								if(element.code === key.code && element.description === key.description &&
								  element.bloom === key.bloom && element.level === key.level){
									bool = false;
								} 
							});

							if(bool === true){
								course.sections[inds].lessons[indl].objectives.push(key);
							} else {
								bool = true;
							}
						});
						course.save(next);
					}
				}
			}
		}], function(err, course) {
			functions.controlErrors(err, res, course.sections[inds].lessons[indl].objectives);
	});
	
};


/**
 *	Deletes objectives from a lesson of a section and a course.
 */
exports.deleteObjectives = function(req, res) {	
	var courseId = req.params.idc,
		sectionId = req.params.ids,
		lessonId = req.params.idl,
		inds = 0,
		indl = 0,
		new_obj = req.body,
		obj = -1;
	async.waterfall([
   	 	Courses.findById.bind(Courses, courseId),
    	function(course, next) {
			if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registered');
			} else {
				inds = functions.exist_section_lesson(sectionId,course.sections);

				if (inds < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {
					indl = functions.exist_section_lesson(lessonId,course.sections[inds].lessons);
					
					if (indl < 0) {
						res.status(404).send('The lesson with id : ' + lessonId +
						' has not been found in the section with id: ' + sectionId);
					} else {
						var objectives = course.sections[inds].lessons[indl].objectives;
						
						_.forEach(new_obj, function(key){
							objectives.find(function(element, index){
								if(element.code === key.code && element.description === key.description &&
								  element.bloom === key.bloom && element.level === key.level){
									obj = index;
								} 
							});

							if(obj > -1){
								course.sections[inds].lessons[indl].objectives.splice(obj, 1);
								obj = -1;
							}
						});
						course.save(next);
					}
				}
			}
		}], function(err, course) {
			functions.controlErrors(err, res, course.sections[inds].lessons[indl].objectives);
	});
	
};


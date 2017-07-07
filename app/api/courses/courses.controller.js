'use strict';
/* jshint node: true */

var Courses = require('./courses.model.js'),
	Students = require('../students/students.model.js'),
    CoursesFunctions = require('./courses.functions.js'),
    async = require('async'),
    fs = require('fs'), 
    mongoose = require('mongoose'),
    _ = require('lodash');


/**
 *	List of requests:
 *
 *	- all: 					Returns all courses
 *
 *	- get: 					Returns a course by id.
 *
 *	- remove: 				Removes a course by id.
 *
 *	- reset: 				Destroys all courses.
 *
 *	- create: 				Creates a new course.
 *
 *	- update: 				Updates a course by id.
 *
 *	- getObjectives: 		Returns course objectives list.
 *
 *	- includePhoto: 		Include photo in a course.
 *
 *	- getActivity: 			Function to obtain one or more activities to correct them.
 *
 *	- correctActivity: 		Function to corrects an activity.
 */
	

/**
 * 	Returns all courses
 */
exports.all = function (req, res) {
    Courses.find({}, function (err, course) {
		CoursesFunctions.controlErrors(err, res, course);
	});
};

/**
 * 	Returns a course by id
 */
exports.get = function (req, res){
	var courseId = req.params.id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
	        	console.log(err);
				res.status(err.code).send(err);				
			} else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				res.status(200).json(course); 
			} 			 
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

/**
 * 	Removes a course by id
 */
exports.remove = function(req,res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course) {
	    	if(!course){
				res.status(404).send('The course with id: ' + req.params.id + ' is not registrated');
			} else{
				Courses.remove({_id: course._id}, function (err, resp) {
			        CoursesFunctions.controlErrors(err, res, resp);
			    });
			}
	    }
	], function(err) {
	    if (err) {
	    	console.log(err);
			res.status(err.code).send(err);				
	    } else {
	    	res.sendStatus(200);
	    }
	});
};

/**
 * 	Destroys all courses
 */
exports.reset  = function(req, res){
    Courses.remove({}, function (err, resp) {
	    CoursesFunctions.controlErrors(err, res, resp);
    });
};

/**
 * 	Creates a new course
 */
exports.create = function(req, res) {
	if (req.body.name){
		Courses.findOne({name: req.body.name}, function(err, course) {
			if(err){
				console.log(err);
	        	res.status(err.code).send(err);
			} else if(!course){
			    Courses.create(req.body, function (err1, course1) {
					if (err1) {
						console.log(err1);
						res.status(err1.code).send(err1);
					}
					console.log('Course created!');
					var idCse = course1._id;
					res.writeHead(200, {
						'Content-Type': 'text/plain'
					});
					res.end('Added the course with id: ' + idCse);
				});
			} else {
				res.status(403).send('A course with the same name already exists');
			}
		});
	} else {
		res.status(400).send('Course name is required');
	}
};

/**
 *  Updates a course by id
 */
exports.update = function(req, res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
			if(req.body.name){
				Courses.findOne({name: req.body.name}, function(err, course2) {
					if(err){
						console.log(err);
			        	res.status(err.code).send(err);
					} else if(!course2){
						res.status(200);
					} else {
						if(course._id.equals(course2._id)){
							res.status(200);
						} else {
							res.status(400).send('A course with the same name already exists');
						}
					}
	
					if(res.statusCode === 200) {
						var newCourse = CoursesFunctions.doUpdate(course, req.body);
						course = _.extend(course, newCourse);
						course.save(next);						
					}
				});
			} else {
				res.status(200);
				var newCourse = CoursesFunctions.doUpdate(course, req.body);
				course = _.extend(course, newCourse);
				course.save(next);	
			}
	    }
	], function(err, course) {
	    CoursesFunctions.controlErrors(err, res, course);
	});		
};


/**
 *	Returns course objectives list
 */
exports.getObjectives = function (req, res){
	var courseId = req.params.id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
	        	console.log(err);
				res.status(err.code).send(err);				
			} else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				res.status(200).json(course.objectives); 
			} 			 
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};


/**
 * Include photo in a course
 */
exports.includePhoto =  function (req, res) {
	Courses.findOne({_id: req.params.id}, function(err, course){
		if(!course) { 
			res.status(404).send('The course with id: '+  req.params.id +' is not registrated');
		} else {
			fs.stat(__dirname + '/../../res/files/photos/' + req.params.id, function(err){
				if(err) { fs.mkdir(__dirname + '/../../res/files/photos/' + req.params.id); }
			});
			var file = __dirname + '/../../res/files/photos/' + req.params.id + '/' + req.file.originalname;
			course.photo = file;
			fs.readFile( req.file.path, function (err, data) {
				if(!data) {res.status(400).send('No data to upload');
				} else {
					fs.writeFile(file, data, function (err) {
						if( err ){
							console.error( err );
					        res.status(404).send(err);
						    res.end('Sorry, the photo: '+  req.file.originalname + 
							' couldn\'t be uploaded in the course with id: ' + req.params.id);

						}else{
						    res.end('Photo: '+  req.file.originalname + 
							' uploaded successfully in the course with id: ' + req.params.id);
						}
					});
				}
			});
			course.save();
		}
			 
	});
};

/**
 *	Function to obtain one or more activities to correct them.
 */
exports.getActivity = function (req, res) {
	var ret = [];
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.idc),
	    function(course, next) {
			if(!course){
				res.status(404).send('The course with id: ' + req.params.idc + ' is not registrated');
			} else{


				if(course.solutions.length > 0){
					switch(req.params.findBy){
						case 'student':
							var student = req.params.idFind;

							course.solutions.find(function(element){
								if(element.idStudent.toString() === student.toString()){
									ret.push(element);
								}
							});
							res.status(200);
							break;
						
						case 'lom':
							var lom = req.params.idFind;

							course.solutions.find(function(element){
								if(element.idLom.toString() === lom.toString()){
									ret.push(element);
								}
							});
							res.status(200);
							break;

						case 'first':
							ret.push(course.solutions[0]);
							res.status(200);
							break;
							
						default:
							ret = 'the findBy value:' + req.params.findBy + ' is not correct';
							res.status(400);
							break;
					}
				} else {
					res.status(404);
					ret = 'The course has no activities to correct';
				}
			}
			course.save(next);
		}
	], function(err) {
		CoursesFunctions.controlErrors(err, res, ret);
	});
};

/**
 *	Function to corrects an activity.
 */
exports.correctActivity = function(req, res){
	var ret, bool = false,
		idLom = req.params.idl,
		idCourse = req.params.idc,
		idStudent = req.params.idstd,
		score = req.params.score;

	async.waterfall([
	    Courses.findById.bind(Courses, idCourse),
	    function(course, next) {
			if(!course){
				res.status(404).send('The course with id: ' + idCourse + ' is not registrated');
			} else{
				Students.findOne({_id: idStudent}, function(err, student){
					if(err){
						console.log(err);
			        	res.status(err.code).send(err);
					} else if(!student){
						res.status(404).send('The student with id: ' + idStudent + ' is not registrated');
					}else {
						
						// Selects the last element from activity log with the same idLOM and idCourse
						var lastElement = {idLom: ''};
						student.activity_log.find(function(element){
							if(element.idLom === idLom && element.idCourse === idCourse){
								if(lastElement.idLom === '' || lastElement.created_at < element.created_at){
									lastElement = element;
								} else if(lastElement.created_at < element.created_at){
									lastElement = element;
								}
							}
						});

						student.activity_log.find(function(element){
							if(element === lastElement){
								element.score = score;
								
								// If the student passes activity
								if(score >= 5){
									element.status = 1;

									var lesson = CoursesFunctions.exist_section_lesson(element.idLesson, course.sections[0].lessons);
									lesson = course.sections[0].lessons[lesson];
									// The knowledge level is updated
									student.knowledgeLevel.find(function(element1){
										if(element1.code === lesson.objectives[0].code && element1.level === lesson.objectives[0].level){
											bool = true;
										}
									});
									
									if(bool === false && lesson.objectives.length !== 0){
										student.knowledgeLevel.push(lesson.objectives[0]);
									} 

								} else {
									element.status = -1;
								}
								ret = element;

								student.course.find(function(element1){
									if(element1.idLom === idLom && element1.idCourse === idCourse){
										element1.status = element.status;
									}
								});

								// The activity is removed from the list of pending activities to be corrected.
								course.solutions.find(function(element1, index1){
									if(element1.idLom === idLom && element1.idStudent === idStudent){
										course.solutions.splice(index1, 1);
									}
								});

								course.save(next);
							}
						});
					}
					student.save();
				});

			}
		}
	], function(err) {
		CoursesFunctions.controlErrors(err, res, ret);
	});
};

/**
 *	Includes objectives in a course.
 */
exports.includeObjectives = function(req, res) {	
	var courseId = req.params.id,
		new_obj = req.body,
		bool = true;
	async.waterfall([
   	 	Courses.findById.bind(Courses, courseId),
    	function(course, next) {
			if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var objectives = course.objectives;
				_.forEach(new_obj, function(key){
					objectives.find(function(element){
						if(element.code === key.code && element.description === key.description &&
						  element.bloom === key.bloom && element.level === key.level){
							bool = false;
						} 
					});

					if(bool === true){
						course.objectives.push(key);
					} else {
						bool = true;
					}
				});
				course.save(next);
			}
		}], function(err, course) {
			CoursesFunctions.controlErrors(err, res, course.objectives);
	});
	
};

/**
 *	Deletes objectives from a course.
 */
exports.deleteObjectives = function(req, res) {	
	var courseId = req.params.id,
		new_obj = req.body,
		obj = -1;
	async.waterfall([
   	 	Courses.findById.bind(Courses, courseId),
    	function(course, next) {
			if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var objectives = course.objectives;
				_.forEach(new_obj, function(key){
					objectives.find(function(element, index){
						if(element.code === key.code && element.description === key.description &&
						  element.bloom === key.bloom && element.level === key.level){
							obj = index;
						} 
					});

					if(obj > -1){
						course.objectives.splice(obj, 1);
						obj = -1;
					}
				});
				course.save(next);
			}
		}], function(err, course) {
			CoursesFunctions.controlErrors(err, res, course.objectives);
	});
	
};






'use strict';

/*
This version works with the following exported functions.
all: list all courses
get: list the course specified by course_name. 
	If there are several courses with the same name,
	then all of them will be showed
create: insert the course received as parameter
remove: delete the course received as parameter
update: update the course received as parameter
the new course is received via the request body in JSON format
update1: update the course received as parameter, but 
just the field with the value indicated via JSON 
format in the body of the request. 
*/

var Courses = require('./courses.model.js'),
	Students = require('../students/students.model.js'),
    config = require('../../res/config.js'),
    CoursesFunctions = require('./courses.functions.js'),
    async = require('async'),
    fs = require('fs'), 
    mongoose = require('mongoose'),
    _ = require('lodash');
	

// Exporting all function
// list all courses
exports.all = function (req, res) 
	{
	// console.log(config)
    Courses.find({}, function (err, course) {
		CoursesFunctions.controlErrors(err, res, course);
	});
};

// Exporting get function
// list the course specified by its id
// If there are none with this id, then it returns an empty list []
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

// Exporting remove function
// delete the course received as parameter
// If the course does not exist in the database, 
// it considers the course removed anyway
exports.remove = function(req,res) {
	async.waterfall([
	    Courses.findById.bind(Courses, req.params.id),
	    function(course, next) {
	    	if(!course){
				res.status(404).send('The course with id: ' + req.params.id + ' is not registrated');
			} else{
				Courses.remove({_id: course._id}, function (err, resp) {
			        CoursesFunctions.controlErrors(err, res, resp);
			    });
			}
	    }
	], function(err, course) {
	    if (err) {
	    	console.log(err);
			res.status(err.code).send(err);				
	    } else {
	    	res.sendStatus(200);
	    }
	});
};

/**
 * Destroys all elements
 */
exports.reset  = function(req, res){
    Courses.remove({}, function (err, resp) {
	    CoursesFunctions.controlErrors(err, res, resp);
    });
};

// Exporting create function
// insert the course received as parameter
exports.create = function(req, res) {
	var bool = false;
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

// Exporting update function
// update the course received as parameter
// the new course is received via the request body in JSON format
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


// Exporting get function
// list the objectives of the course specified by its id
// If there are none with this id, then it returns an empty list []
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
			fs.stat(__dirname + '/../../res/files/photos/' + req.params.id, function(err, stats){
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

							course.solutions.find(function(element, index, array){
								if(element.idStudent.toString() === student.toString()){
									ret.push(element);
								}
							});
							res.status(200);
							break;
						
						case 'lom':
							var lom = req.params.idFind;

							course.solutions.find(function(element, index, array){
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
	], function(err, course) {
		CoursesFunctions.controlErrors(err, res, ret);
	});
};

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
						student.activity_log.find(function(element, index, array){
							if(element.idLom === idLom && element.idCourse === idCourse){
								element.score = score;
								
								if(score >= 5){
									element.status = 1;

									var lesson = CoursesFunctions.exist_section_lesson(element.idLesson, course.sections[0].lessons);
									lesson = course.sections[0].lessons[lesson];
									student.knowledgeLevel.find(function(element1, index1, array1){
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

								student.course.find(function(element1, index1, array1){
									if(element1.idLom === idLom && element1.idCourse === idCourse){
										element1.status = element.status;
									}
								});

								course.solutions.find(function(element1, index1, array1){
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
	], function(err, course) {
		CoursesFunctions.controlErrors(err, res, ret);
	});
};


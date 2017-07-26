'use strict';
/* jshint node: true */

var Students = require('./students.model.js'),
	async = require('async'),
	_ = require('lodash'),
	functions = require('./students.functions.js'), 
	functions2 = require('../courses/courses.functions.js'),
	Courses = require('../courses/courses.model.js'),
	RuleEngine = require('node-rules'),
	mongoose = require('mongoose'),
	LOMS = require('../loms/loms.model.js');

var rules = require('../../res/rules.json');
var ruleEngineGR = new RuleEngine();
ruleEngineGR.fromJSON(rules);
var learning_rules = require('../../res/learning_rules.json');
var ruleEngineLS = new RuleEngine();
ruleEngineLS.fromJSON(learning_rules);

/**
 *	List of requests:
 *
 *	- all: 				Returns all students.
 *
 *	- get: 				Returns a student by id.
 *
 *	- create: 			Creates a new student.
 *
 *	- update: 			Updates a student by id.
 *
 *	- remove: 			Removes a student by id.
 *
 *	- destroy: 			Destroys all students.
 *
 * 	- getKnowledge: 	Returns an student knowledge Level by id.
 *
 *	- getLesson: 		Returns a specific lesson by id.
 *
 *	- activate: 		Activates an student by id.
 *
 *	- deactivate: 		Deactivates an student by id.
 *
 *	- init: 			Includes a learning style in a student.
 *
 *	- group: 			Group a student according to their academic results.
 *
 *	- enrollment: 		Enrollments a student by id in a course.
 *
 *	- unenrollment: 	Unenrollments a student by id of a course.
 *
 *	- dataCourses: 		Returns the finished courses, courses not completed, 
 *						the active courses, last included and related courses of a student.
 *
 *	- newActivity: 		Returns the next activity of the course in which the student is enrolled,
 *  					depending on their previous activity and the result of the same.
 *
 *	- finalizeActivity: Sends the activity solution to the teacher to correct it or pause an activity.
 *						
 */


/**
 * Returns all students
 */
exports.all = function (req, res) {
	Students.find({active: 1}, function (err, student) {
		functions.controlErrors(err, res, student);
	});
};

/**
 * Returns a student by id
 */
exports.get = function (req, res) {
	var finder;
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
		finder = {_id: req.params.id};
	} else {
		finder = {'identification.email': req.params.id};
	}

	Students.findOne(finder, function(err, student) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		}else if(!student){
			res.status(404).send('The student with id o email: ' + req.params.id + ' is not registrated');
		} else {
			if(student.active === 1){
				var arrayCourses = [];
				/**
				 * 	Only active courses are shown.
				 */
				student.course.find(function(element){
					if(element.active === 1){ 
						arrayCourses.push(element); 
					} 
				});
				student.course = arrayCourses;
				if(res.statusCode === 200){
					res.json(student);
				} else {
					res.sendStatus(res.statusCode);
				}
			} else {
				res.status(403).send('The student with id: ' + req.params.id + ' is not activated');
			}
		}
	});
};

/**
 * Creates a new student
 */
exports.create = function(req, res) {
	var bool = false;
	if (req.body.identification.email){
		Students.find({}, function(err, students) {
			if(err){
				console.log(err);
	        	res.status(err.code).send(err);
			} else {
				for(var i = 0; i< students.length; i++){
					if(students[i].identification.email === req.body.identification.email){
						bool = true;
						break;
					}
				}
				// The email is unique
				if(bool === false){
				    Students.create(req.body, function (err, student) {
				        if (err){
				        	console.log(err);
				        	res.status(err.code).send(err);
				        } else {
				        	console.log('Student created!');

				        	var features = functions.calcFeatures(student);
				        	// Calculate the student's group
							ruleEngineGR.execute(features, function(result){
								student.learningStyle.group = result.group;
								if(req.body.learningStyle){
									// If the learning style is included, the student's 
									// ideal format type is calculated
					        		ruleEngineLS.execute(student, function(result1){
										student.learningStyle.type = result1.type;
										student.save();
										res.json(student);
									});
					        	} else {
					        		// If learning style is not included, a survey is returned.
									var json_survey = require('../../res/learningstyle.json'); 
									
									json_survey.id_student = student._id;
									json_survey.nuevo = 1;
									console.log("Formulario completo" + json_survey.form.length);
									student.save();
									res.json(json_survey);
								}
							});
				        }
				    });
				} else {
					// If learning style is not included, a survey is returned.
					var json_survey = require('../../res/learningstyle.json'); 
					json_survey.id_student = students[i]._id;
					json_survey.nuevo = 0;
					console.log("Formulario vacio" + json_survey.form.length);
					res.json(json_survey);
					
					//res.status(403).send('A student with the same email already exists');
				}
			}
		});
	} else {
		res.status(400).send('Student email is required');
	}
};


/**
 *  Updates a student by id
 */
exports.update = function(req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	    	if(student.active === 1) {
	    		// Email is unique.
				if(req.body.identification.email){
					Students.findOne({'identification.email': req.body.identification.email}, function(err, student2) {
						if(err){
							console.log(err);
				        	res.status(err.code).send(err);
						} else if(!student2){
							res.status(200);
						} else {
							if(student._id.equals(student2._id)){
								res.status(200);
							} else {
								res.status(400).send('A student with the same email already exists');
							}
						}
		
						if(res.statusCode === 200) {
							var newStudent = functions.doUpdate(student,req.body);
              student = _.extend(student, newStudent);
							student.save(next);						
						}
					});
				} else {
					res.status(200);
					var newStudent = functions.doUpdate(student,req.body);
          student = _.extend(student, newStudent);
					student.save(next);	
				}
			} else {
				res.status(403).send('The student with id: ' + req.params.id + ' is not activated');
			}
	    }
	], function(err, student) {
	    functions.controlErrors(err, res, student);
	});		
};

/**
 * Returns an student knowledge Level by id
 */
exports.getKnowledge = function (req, res) {
	var finder;
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
		finder = {_id: req.params.id};
	} else {
		finder = {'identification.email': req.params.id};
	}

	Students.findOne(finder, function(err, student) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		}else if(!student){
			res.status(404).send('The student with id o email: ' + req.params.id + ' is not registrated');
		} else {
			if(student.active === 1){
				if(res.statusCode === 200){
					res.json(student.knowledgeLevel);
				} else {
					res.sendStatus(res.statusCode);
				}
			} else {
				res.status(403).send('The student with id: ' + req.params.id + ' is not activated');
			}
		}
	});
};


/**
 * Returns a specific lesson by id
 */
exports.getLesson = function (req, res) {
	var finder, courseId = req.params.idc, sectionId = req.params.ids, lessonId = req.params.idl;
	if(mongoose.Types.ObjectId.isValid(req.params.idstd)){
		finder = {_id: req.params.idstd};
	} else {
		finder = {'identification.email': req.params.idstd};
	}

	Students.findOne(finder, function(err, student) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		}else if(!student){
			res.status(404).send('The student with id o email: ' + req.params.idstd + ' is not registrated');
		} else {
			if(student.active === 1){

				if(mongoose.Types.ObjectId.isValid(courseId)){
					Courses.findOne({_id: courseId}, function(err, course) {
				        if (err) {
				        	console.log(err);
							res.status(err.code).send(err);				
						} else if(!course){
							res.status(404).send('The course with id: ' + courseId + ' is not registrated');
						} else {
							var inds = functions2.exist_section_lesson(sectionId,course.sections);
							if (inds < 0){
								res.status(404).send('The section with id : ' + sectionId +
								' has not been found in the course with id: ' + courseId);
							} else {	// section exists
								var indl = functions2.exist_section_lesson(lessonId,course.sections[inds].lessons);
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
			} else {
				res.status(403).send('The student with id: ' + req.params.idstd + ' is not activated');
			}
		}
	});
};

/**
 * Activates an student by id
 */
exports.activate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: 1});
	       	student.save(next);
	    }
	], function(err, student){
		functions.controlErrors(err, res, student);
	});
};

/**
 * Deactivates an student by id
 */
exports.deactivate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: 0});
	       	student.save(next);
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};


/**
 *  Includes a learning style in a student
 */
exports.init = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students,  req.params.id),
	    function(student, next) {
			if(student.active === 1){
				var answers = req.body.answers.answers; // FRM front-end error
				for (var i = 0; i < answers.length; i++) { 
					switch(answers[i].id_question) {
					case 'ls_comp': 
		    			student.learningStyle.comprehension = answers[i].value;
		        		break;
		    		case 'ls_input':
		   				student.learningStyle.input = answers[i].value;
		     			break;
		    		case 'ls_per':
		    			student.learningStyle.perception = answers[i].value;
		   				break;
		   			case 'ls_proc':
		   				student.learningStyle.processing = answers[i].value;
		    			break;
		   			default:
		   			 	res.status(400).send('The id_question: ' +
		   			 	  answers[i].id_question + ' is not correct');
		   			 	break;
					}
				}
				// Calculate the learningStyle type for LOMs format.
				ruleEngineLS.execute(student, function(result){
					student.learningStyle.type = result.type;
					student.save(next);
				});

			} else {
				res.status(403).send('The student with id: ' + req.params.id + ' is not activated');
			}
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

/** 
 *	Function to group a student according to their academic results
 */
exports.group = function(req,res) {
	async.waterfall([Students.findById.bind(Students, req.params.id),
		function(student, next) {
			if(!student){
				res.status(404).send('The student with id: ' + req.params.id + ' is not registrated');
			} else if(student.active !== 1){
				res.status(403).send('The student with id: ' + student._id + ' is not activated');
			} else {
				
				var features = functions.calcFeatures(student);

				ruleEngineGR.execute(features, function(result){
					student.learningStyle.group = result.group;
					student.save(next);
				});
				
			}
		}
	], function(err, student) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		} else {
		 	res.status(200).send(student.learningStyle);
		}
	});
};

/**
 * Enrollments a student by id in a course
 */
exports.enrollment = function (req, res) {
	var activity;
	var newCourse, type;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){ 
				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code);
			        activity = err;
			    } else if(!course){
					res.status(404).send('The course with id: ' + req.params.idc + ' is not registrated');
				} else {
					if(student.active === 1){
						var coursed = false;
						/** 
						 *	The course is searched in the courses in which the student is enrolled to verify 
						 *	that he is not enrolled in the course.
						 */
						student.course.find(function(element){
							if(element.idCourse === req.params.idc){
								if (element.active === 1){ 
									res.status(400).send('The student: ' + student._id + 
										' is already enrolled in the course with id: ' + req.params.idc);
								} else { 
									element.active = 1;
								}
								activity = element;
								coursed = true;
							}
						});
						// if student is activated and is not enrolled in the same course
						if(!coursed){ 
							/**
							 *	If you are not enrolled in the course previously, 
							 *	the type is assigned fot the student for that course and enrolled in it
							 */
							type = functions.assignTypeStudent(student, course);

							if(type === -1 ){
								res.status(400).send('The student with id: ' + student._id + 
									' does not have an assigned group.');

							} else if(type === -2){
								res.status(400).send('The course with id: ' + course._id + 
									' does not have an assigned section.');

							} else {
								student.identification.type = type;

								newCourse = {idCourse: course._id, idSection: '', 
								idLesson: '', idLom: '', status: 0, active: 1};

								student.course.push(newCourse);
								activity = newCourse;
								// The student changes in the course statistics
								course.statistics.std_enrolled.push(student._id);
							}

							course.save();
						}
						student.save(next);	 
					} else {
						res.status(403).send('The student with id: ' + req.params.idstd + ' is not activated');
					}		
				}
			});	
	    }
	], function(err) {
		functions.controlErrors(err, res, activity);
	});
};

/**
 * Unenrollments a student by id of a course
 */
exports.unenrollment = function (req, res) {
	var activity;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){ 
				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(student.active === 1){
						var coursed = false;
						student.course.find(function(element, index){
							if(element.idCourse === req.params.idc && element.active !== 0){
								coursed = true;
								element.active = 0;
								activity = element;
								// The student changes in the course statistics
								course.statistics.std_unenrolled.push(student._id);
								course.statistics.std_enrolled.find(function(element1, index1, array1){
									if(element1 === student._id){
										array1.splice(index, 1);
									}
								});
								course.save();
								student.save(next);
							}
						});
						if(!coursed){ res.status(400).send('The student: ' + student._id +
							 ' is not enrolled in the course with id: ' + req.params.idc); }
					} else {
						res.status(403).send('The student with id: ' + req.params.idstd + ' is not activated');
					}
			    }
			});	
	    }
	], function(err) {
		functions.controlErrors(err, res, activity);
	});
};

/**
 *	Function to obtain the finished courses, courses not completed, 
 *	the active courses, last included and related courses of a student.
 */
exports.dataCourses = function (req, res) {
	var data = [];
    Students.findOne({_id: req.params.id}, function(err, student) { 
    	if(err){
    		console.log(err);
			res.status(err.code).send(err);
    	} else if(!student){
    		res.status(404).send('The student with id: ' + req.params.id + ' is not registrated');
    	} else {
    		if(student.active === 1){
	    		Courses.find({}, function(err, courses){
		    		res.status(200);
					switch(req.params.data){
						case 'courses-done':
							data = functions.getCoursesDone(student, courses);
							break;
						case 'courses-not-done':
							data = functions.getCoursesNotDone(student, courses);
							break;
						case 'active-courses':
							data = functions.getActiveCourses(student);
							break;
						case 'last-included':
							data = functions.getLastCourses(student, courses);
							break;
						case 'related-courses':
							data = functions.getRelatedCourses(student, courses);
							break;
						case 'all':
							data = {coursesDone: [], coursesNotDone: [], activeCourses: [], lastIncluded: [],
								relatedCourses: []};
							data.coursesDone = functions.getCoursesDone(student, courses);
							data.activeCourses = functions.getActiveCourses(student);
							data.coursesNotDone = functions.getCoursesNotDone(student, courses);
							data.lastIncluded = functions.getLastCourses(student, courses);
							data.relatedCourses = functions.getRelatedCourses(student, courses);
							break;
						default:
							data = 'Error: ' + req.params.data + ' is not correct';
							res.status(400);
							break;
					}
					res.send(data);
				});
			} else {
				res.status(403).send('The student with id: ' + req.params.idstd + ' is not activated');
			}
		}
    });
};


/**
 *  This function returns the next activity of the course in which
 *  the student is enrolled, depending on their previous activity
 *  and the result of the same.
 */
exports.newActivity = function (req, res) {
	var activity, ret = 0,
	coursed = false;
	
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { //find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){ 

				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else if(!course){
					res.status(404);
					activity = 'The course with id: ' + req.params.idc + ' is not registrated';
				} else {
					if(student.active === 1){

						coursed = true;							
						student.course.find(function(element){
							if(course._id.equals(element.idCourse)){
								
								if(element.active === 1 || element.active === -1 ){
									element.active = 1;
									coursed = true;
									
									/** 
									 *  By 'next Activity' function calculate the next activity,
									 *  this function is explained in 'students.functions.js'.
									 */

									if(element.status === 3){
										ret = -4;

									} else if(element.status !== 2){

										ret = functions.nextActivity(element, course, student);	
									} else {
										ret = element;
									}

									switch (ret){
									case -1:
										/**
										 *	The completed course is included in the student's statistics.
										 */
										course.statistics.std_finished.push(student._id);
										course.statistics.std_enrolled.find(function(element, index, array){
											if(student._id.equals(element)){
												array.splice(index,1) ;
											}
										});
										activity = student.knowledgeLevel;
										element.status = -2;
										res.status(200);
										student.save(next);
										break;
									case -2:
										res.status(404);
										activity = 'There is a section without lessons';
										student.save(next);
										break;
									case -3:
										res.status(404);
										activity = 'There is a course without sections';
										student.save(next);
										break;
									case -4:
										res.status(400);
										activity = 'The student is waiting for a correction';
										student.save(next);
										break;

									default:	
										
										element = ret;
										/**
										 *	If the activity returned is basic, the student's type is calculated.
										 */
										var lesson = functions2.exist_section_lesson(element.idLesson, course.sections[0].lessons);
										lesson = course.sections[0].lessons[lesson];

										if(lesson.type === 'Essential'){
											student = functions.adaptativeMode(student, course);
											console.log('-------------- Tipo: ' + student.identification.type);
										}

										/**
										 *	If the next activity is returned, the best 
										 *	LOM format is selected for the student.
										 */
										var lomRet = functions.selectLOM(student, element, course);

										if (lomRet !== -1){
											element.idLom = lomRet;


											if(element.status !== 2){

												student.activity_log.push(
													{
														idCourse: element.idCourse,
														idSection: element.idSection,
														idLesson: element.idLesson,
														idLom: element.idLom,
														status: element.status,
														duration: 0,
														created_at: Date.now()
													}
												);
											} else {


												student.activity_log.find(function(element1){
													if(element1.idCourse === element.idCourse && element1.idLom === element.idLom){
														
														element1.created_at = Date.now();

													}
												});
											}
											
											/**
											 *  Once the following activity is obtained, the function 
											 *  returns the LOM information corresponding to that activity.
											 */
											
											LOMS.find({_id: element.idLom}, function(err, lom) {
												
											    if (err) {
											        console.log(err);
											        res.status(err.code).send(err);
												} else {
								            		if(!lom){ 														
														res.status(404);
														activity = 'The lom: ' + element.idLom + ' is not registrated';
													} else {
														if(lom.length > 0){ activity = lom[0]; }
														else{ activity = lom; }
														
														student.save(next);
													}
												}
											});	
											break;
										} else {
											res.status(404);
											activity = 'There is a lesson without loms';
										}
									}
								}
							}
						});							
					} else {
						res.status(403);
						activity = 'The student with id: ' + student._id + ' is not activated';
					}
				}
				if(!coursed){
					res.status(404);
					activity = 'The student: ' + student._id + 
					' is not enrolled in the course with id: ' + req.params.idc;
				} 	
				course.save();
			
			});	
	    }
	], function(err) {		
		functions.controlErrors(err, res, activity);
	});
};

/**
 *	This function sends the activity solution to the teacher to correct it
 *	or pause an activity.
 */
exports.finalizeActivity = function(req, res){
	var ret;
	var solution = req.body;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(student.active === 1){
						var coursed = false;
						student.course.find(function(element){
							if(element.idCourse === req.params.idc){
								if(element.active === 1){
									coursed = true;
									if (element.idLom === req.params.idl){
										switch(req.params.status){
											case 'idle': // pause the activity.
												element.status = 2;
												ret = 'Activity paused correctly';
												res.status(200);
												break;

											case 'finalize': // finalize the activity.
												element.status = 3;
												res.status(200);
												ret = 'The solution was successfully sent';
												// The activity solution is sent to correct it.
												course.solutions.push({

													idStudent: student._id,
													idSection: element.idSection,
													idLesson: element.idLesson,
													idLom: element.idLom,
													solution: JSON.stringify(solution)

												});
												course.save();
												break;

											case 'ok':
												var bool = false;
												element.status = 1;
												res.status(200);

												var lesson = functions2.exist_section_lesson(element.idLesson, course.sections[0].lessons);
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

												ret = element;
												break;

											case 'nok':
												element.status = -1;
												res.status(200);
												ret = element;
												break;

											default:
												res.status(400);
												ret = 'the status: ' + req.params.status + ' is not correct'; 
												break;
										}

										if(res.statusCode === 200){
											// The activity duration is updated 
											student.activity_log.find(function(element1){
												if (element1.idCourse === element.idCourse && element1.idSection === element.idSection && 
												  element1.idLesson === element.idLesson && element1.IdLom === element.IdLom){

													element1.duration = element1.duration + (Date.now() - element1.created_at);
													element1.status = element.status;
													element1.solution = JSON.stringify(solution);
												}
											});
										}


										student.save(next);
									} else {
										res.status(404);
										ret = 'The student: ' + student._id + ' does not have the lom: ' + req.params.idl;
									}

								} else {
									res.status(403);
									ret = 'The student: ' + student._id + ' is not activated in the course with id: ' + req.params.idc;
								}
							}
						});

						if(!coursed){
							res.status(400);
							ret = 'The student: ' + student._id + ' is not enrolled in the course with id: ' + req.params.idc;
						}
					} else {
						res.status(403); 
						ret = 'The student with id: ' + student._id + ' is not activated';
					}
				}
			});
		}
	], function(err) {
		functions.controlErrors(err, res, ret);
	});
};

/**
 * Removes a student by id
 */
exports.remove = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
			if(!student){
				res.status(404).send('The student with id: ' + req.params.id + ' is not registrated');
			} else{
			    Students.remove({_id: student._id}, function (err, resp) {
			        functions.controlErrors(err, res, resp);
			        student.save(next);
			    });
			}
	    }
	], function(err) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		} else {
		 	res.sendStatus(200);
		}
	});
};

/**
 * Destroys all students
 */
exports.destroy  = function(req, res){
	Students.remove({}, function (err, resp) {
		functions.controlErrors(err, res, resp);
	});
};

/**
 *	Returns true or false if the student is or is not enrolled in the course 
 */
exports.isEnrolled = function(req, res){
	var bool = false;
	async.waterfall([
	    Students.findById.bind(Students, req.params.idstd),
	    function(student, next) {
	    	student.course.find(function(element){
	    		if(element.idCourse === req.params.idc && element.active !== -1){
	    			bool = true;
	    		}
	    	});
	    	student.save(next);
	    }
	], function(err) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		} else {
		 	res.status(200).send(bool);

		}
	});
}












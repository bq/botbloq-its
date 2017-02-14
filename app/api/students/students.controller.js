'use strict';

var Students = require('./students.model.js'),
	config = require('../../res/config.js'), 
	async = require('async'),
	_ = require('lodash'),
	functions = require('./students.functions.js'), 
	functions2 = require('../courses/courses.functions.js'),
	Courses = require('../courses/courses.model.js'),
	mongoose = require('mongoose'),
	LOMS = require('../loms/loms.model.js');


//ALL STUDENTS
/**
 * Returns all elements
 */
exports.all = function (req, res) {
	Students.find({active: 1}, function (err, student) {
		functions.controlErrors(err, res, student);
	});
};

/**
 * Creates a new element
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
					}
				}
				if(bool === false){
				    Students.create(req.body, function (err, student) {
				        if (err){
				        	console.log(err);
				        	res.status(err.code).send(err);
				        } else {
					        console.log('Student created!');
							var json_survey = require('../../res/learningstyle.json'); 
							json_survey.id_student = student._id;
							res.json(json_survey);
				        }
				    });
				} else {
					res.status(403).send('A student with the same email already exists');
				}
			}
		});
	} else {
		res.status(400).send('Student email is required');
	}
};

/**
 * Destroys all elements
 */
exports.destroy  = function(req, res){
	Students.remove({}, function (err, resp) {
		functions.controlErrors(err, res, resp);
	});
};

//BY ID	
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
 * Returns an student by id
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
			if(functions.studentFound(student, req, res) === true){
				var arrayCourses = [];
				student.course.find(function(element, index, array){
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
			}
		}
	});
};

/**
 *  Updates a student by id
 */
exports.update = function(req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	    	if(functions.studentFound(student, req, res) === true) {
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
			}
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
			if(functions.studentFound(student, req, res) === true){
				var answers = req.body.answers;
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
					}
				}
				student.save(next);
			}
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

/**
 * Enrollments a student by id in a course
 */
exports.enrollment = function (req, res) {
	var activity;
	var newCourse;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){ 
				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else if(!course){
					res.status(404).send('The course with id: ' + 
						req.params.idc + ' is not registrated');
				} else {
					if(functions.studentFound(student, req, res) === true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse === req.params.idc){
								if (element.active === 1){ 
									res.status(400).send('The student: ' + 
										student._id + ' is already enrolled in the course with id: ' +
										req.params.idc);
								} else { 
									element.active = 1;
								}
								activity = element;
								coursed = true;
							}
						});
						// if student is activated and is not enrolled in the same course
						if(!coursed){ 
							newCourse = {idCourse: course._id, idSection: '', 
							  idLesson: '', idLom: '', status: 0, active: -1};

							student.course.push(newCourse);
							activity = newCourse;
							course.statistics.std_enrolled.push(student._id);
							course.save();
						}
						student.save(next);	 
					}
				}
			});	
	    }
	], function(err) {
		functions.controlErrors(err, res, activity);
	});
};

/**
 * Enrollments a student by id in a course
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
					if(functions.studentFound(student, req, res) === true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse === req.params.idc && element.active !== 0){
								coursed = true;
								element.active = 0;
								activity = element;
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
					}
			    }
			});	
	    }
	], function(err, student) {
		functions.controlErrors(err, res, activity);
	});
}

exports.dataCourses = function (req, res) {
	var data = [];
    Students.findOne({_id: req.params.id}, function(err, student) { 
    	if(err){
    		console.log(err);
			res.status(err.code).send(err);
    	} else if(!student){
    		res.status(404).send('The student with id: ' + req.params.id + ' is not registrated');
    	} else {
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
					case 'all':
						data = {coursesDone: [], coursesNotDone: [], activeCourses: []};
						data.coursesDone = functions.getCoursesDone(student, courses);
						data.activeCourses = functions.getActiveCourses(student)
						data.coursesNotDone = functions.getCoursesNotDone(student, courses);
						break;
					default:
						data = 'Error: ' + req.params.data + ' is not correct';
						res.status(400);
						break;
				}
				res.send(data);
			});
		}
    });
}

/**
 *  According receives an 'ok' or 'nok' activity will be
 *  correct or incorrectly completed, respectively.
 */
exports.updateActivity = function (req, res) {
	var ret, bool = false;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			Courses.findOne({_id: req.params.idc}, function(err, course){
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(functions.studentFound(student, req, res) === true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse === req.params.idc){
								if(element.active === 1){
									coursed = true;
									if (element.idLom === req.params.idl){
									
										if (req.params.status === 'ok'){
											element.status = 1;
											ret = student;
											res.status(200);
										} 
										else {
											 if (req.params.status === 'nok'){
											 	element.status = -1;
												ret = student;
												res.status(200);	
											 } 											
											 else {
												res.status(400).send('the status: ' + req.params.status + ' is not correct'); 
											 }
										 }
										 
										 /**
										  *  Include the objetive of the finished lesson in student knowledgeLevel  
										  */
										if(res.statusCode === 200){
											 var lesson = functions2.exist_section_lesson(element.idLesson, course.sections[0].lessons);
											 lesson = course.sections[0].lessons[lesson];
											 student.knowledgeLevel.find(function(element1, index1, array1){
												 if(element1.code === lesson.objectives[0].code && element1.level === lesson.objectives[0].level){
													 bool = true;
												 }
											 });
									 		
											 if(bool === false && lesson.objectives.length !== 0){
												 student.knowledgeLevel.push(lesson.objectives[0]);
											 } 
											 student.activity_log.push(
												 {
													 idCourse: element.idCourse,
													 idSection: element.idSection,
													 idLesson: element.idLesson,
													 idLom: element.idLom,
													 status: element.status
												 }
											 );
									 
											 /**
											  *  To calculate the duration of the activity the created_at of the activity is subtracted 
											  *  with the created_at of the previous activity, or the created_at of the course if it is the first activity.
											  */
									 
											 var lengthAct = student.activity_log.length;
											 if(lengthAct > 1){											 
											 	student.activity_log[lengthAct-1].duration = 
												 		student.activity_log[lengthAct-1].created_at - student.activity_log[lengthAct-2].created_at;
											 } else {
											 	student.activity_log[lengthAct-1].duration = 
												 		student.activity_log[lengthAct-1].created_at - element.created_at;
											 }
									
										}
										
										student.save(next);
									} else{
										res.status(404).send('The student: ' + student._id + ' does not have the lom: ' + req.params.idl);
									} 
								} else{
									res.status(403).send('The student: ' + student._id + ' is not activated in the course with id: ' + req.params.idc);
								} 								
							}
						});
						
						if(!coursed){
							res.status(400).send('The student: ' + student._id + ' is not enrolled in the course with id: ' + req.params.idc);
						} 
					} 
			    }
			});	
	    }
	], function(err, student) {
		functions.controlErrors(err, res, ret);
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
					res.status(404).send('The course with id: ' + req.params.idc + ' is not registrated');
				} else {
					if(functions.studentFound(student, req, res) === true){

						coursed = true;							
						student.course.find(function(element ,index , array){
							if(course._id.equals(element.idCourse)){
								
								if(element.active === 1 || element.active === -1 ){
									element.active = 1;
									coursed = true;
									
									/** 
									 *  By 'next Activity' function calculate the next activity,
									 *  this function is explained in 'students.functions.js'.
									 */
									ret = functions.nextActivity(element, course, student);	
									switch (ret){
									case -1:
										course.statistics.std_finished.push(student._id);
										course.statistics.std_enrolled.find(function(element, index, array){
											if(student._id.equals(element)){
												array.splice(index,1) ;
											}
										});
										activity = 'Course finished';
										res.status(200);
										student.save(next);
										break;
									case -2:
										res.status(404).send('There is a lesson without loms');
										student.save(next);
										break;
									case -3:
										res.status(404).send('There is a section without lessons');
										student.save(next);
										break;
									case -4:
										res.status(404).send('There is a course without sections');
										student.save(next);
										break;
									default:	
										element = ret;
										
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
													res.status(404).send('The lom: ' + element.idLom + ' is not registrated');
												} else {
													if(lom.length > 0){ activity = lom[0]; }
													else{ activity = lom; }
													
													student.save(next);
												}
											}
										});	
										break;
									}
								}
							}
						});							
					} 			
				}
				if(!coursed){
					res.status(404).send('The student: ' + student._id + 
					' is not enrolled in the course with id: ' + req.params.idc);
				} 	
				course.save();
			
			});	
	    }
	], function(err, student) {		
		functions.controlErrors(err, res, activity);
	});
};


/**
 * Removes a element by id
 */
exports.remove = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
			if(!student){
				res.status(404).send('The student with id: ' + req.params.id + ' is not registrated');
			} else{
			    Students.remove(student, function (err, resp) {
			        functions.controlErrors(err, res, resp);
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

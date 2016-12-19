'use strict';

var Students = require('./students.model.js'),
   config = require('../../res/config.js'), 
   async = require('async'),
   _ = require('lodash'),
   functions = require('./students.functions.js'), 
Courses = require('../courses/courses.model.js'),
LOMS = require('../loms/loms.model.js');


//ALL STUDENTS
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    Students.find({active: 1}, function (err, student) {
        if (err){
        	res.sendStatus(err.code);
        } 
		res.json(student);
    });
};

/**
 * Creates a new element
 */
exports.create = function(req, res) {
	var bool = false;
	if (req.body.identification.email !== undefined){
		Students.find({}, function(err, students) {
			if(err){
	        	res.sendStatus(err.status);
			} else {
				for(var i = 0; i< students.length; i++){
					if(students[i].identification.email === req.body.identification.email){
						bool = true;
					}
				}
				if(bool === false){
				    Students.create(req.body, function (err, student) {
				        if (err){
				        	res.sendStatus(err.status);
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
    Students.findOne({_id: req.params.id}, function(err, student) {
		if(err){
        	res.sendStatus(err.status);
		} else {
			if(functions.studentFound(student, req, res) === true){
				res.json(student);
			}
		}
    });
};

/**
 *  Updates a student by id
 */
exports.update = function (req, res) {
	var activity, bool = true;
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
			if(functions.studentFound(student, req, res) === true) {
				if(req.body.identification.email !== undefined){
					Students.find({}, function(err, students) {
						if(err){
				        	res.sendStatus(err.status);
						} else {
							for(var i = 0; i< students.length; i++){
								if(students[i].identification.email === req.body.identification.email) {
									if(students[i]._id.equals(student._id) === false){
										res.status(400);
									}	
								}
							}
							if(res.statusCode !== 400) {
								student = _.extend(student, req.body);
								student.save(next);	
								res.status(200);
							} else {
								res.status(400).send('A student with the same email already exists');
							}
							
							
						}
					});
				} else {
					student = _.extend(student, req.body);
					student.save(next);	
					res.status(200);
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
		   			 	res.end('The id_question: ' + answers[i].id_question + ' is not correct')
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
			Courses.find({name: req.params.idc}, function(err, course){ 
				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(course.length === 0){
						res.status(404).send('The course: ' + req.params.idc + ' is not registrated');
					} else {
						if(functions.studentFound(student, req, res) === true){
							var coursed = false;
							student.course.find(function(element ,index , array){
								if(element.idCourse === req.params.idc){
									if (element.active === 1){ 
										res.status(400).send('The student: ' + student._id + ' is already enrolled in the course: ' + req.params.idc);
									} else { 
										element.active = 1;
									}
									activity = element;
									coursed = true;
								}
							});
							if(!coursed){ 
								newCourse = {idCourse: course[0].name, idSection: '', idLesson: '', idLom: '', status: 0, active: -1};
								student.course.push(newCourse);
								activity = newCourse;
							}
							student.save(next);	 
						}
					}
				}
			});	
	    }
	], function(err, student) {
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
			var Courses = require('../courses/courses.model.js');
			Courses.find({_id: req.params.idc}, function(err, course){ 
				// find a course by id
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(functions.studentFound(student, req, res) === true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse === req.params.idc){
								coursed = true;
								element.active = 0;
								activity = element;
								student.save(next);
							}
						});
						if(!coursed){ res.end('The student: ' + student._id +
							 ' is not enrolled in the course: ' + req.params.idc); }
					}
			    }
			});	
	    }
	], function(err, student) {
		functions.controlErrors(err, res, activity);
	});
}

/**
 *  According receives an 'ok' or 'nok' activity will be
 *  correct or incorrectly completed, respectively.
 */
exports.updateActivity = function (req, res) {
	var ret;
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { 
			//find a student by id
			var Courses = require('../courses/courses.model.js');
			Courses.find({name: req.params.idc}, function(err, course){ 
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
											 	ret = 'the status: ' + req.params.status + ' is not correct';
												res.status(400); 
											 }
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
										
										 console.log(student.activity_log[lengthAct-1]); 									
										student.save(next);
									} else{
										ret = 'The student: ' + student._id + ' does not have the lom: ' + req.params.idl;
										res.status(404);
									} 
								} else{
									ret = 'The student: ' + student._id + ' is not activated in the course: ' + req.params.idc;
									res.status(403);
								} 
							}
						});
						
						if(!coursed){
							ret = 'The student: ' + student._id + ' is not enrolled in the course: ' + req.params.idc;
							res.status(400);
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
	LOMS = require('../loms/loms.model.js');
	
	async.waterfall([
	    Students.findById.bind(Students,  req.params.idstd),
	    function(student, next) { //find a student by id
			var Courses = require('../courses/courses.model.js');
			Courses.find({name: req.params.idc}, function(err, course){ 
				// find a course by name
			    if (err) {
			        console.log(err);
			        res.status(err.code).send(err);
			    } else {
					if(!course){
						activity = 'The course: ' + req.params.idc + ' is not registrated';
						res.status(404);
					} else {
						
						if(functions.studentFound(student, req, res) === true){
							course = course[0];
							coursed = true;							
							student.course.find(function(element ,index , array){
								if(element.idCourse === course.name){
									
									if(element.active === 1 || element.active === -1 ){
										element.active = 1;
										coursed = true;
										
										/** 
										 *  By 'next Activity' function calculate the next activity,
										 *  this function is explained in 'students.functions.js'.
										 */
										
										ret = functions.nextActivity(element, course);	
										
										switch (ret){
										case -1:
											activity = 'Course finished';
											res.status(200);
											student.save(next);
											break;
										case -2:
											activity = 'There is a lesson without loms';
											res.status(404);
											student.save(next);
											break;
										case -3:
											activity = 'There is a section without lessons';											
											res.status(404);
											student.save(next);
											break;
										case -4:
											activity = 'There is a course without sections';
											res.status(404);
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
											        res.status(404).send(err);
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
										}
									}
								}
							});							
						} else{
							res.status(403);
							activity = 'The student: ' + student._id + 
							' is not activated in the course: ' + req.params.idc;	
						} 			
					}
					if(!coursed){
						res.status(404);
						activity = 'The student: ' + student._id + 
						' is not enrolled in the course: ' + req.params.idc;
					} 
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
				res.end('The student with id: ' + req.params.id + ' is not registrated');
			} else{
			    Students.remove(student, function (err, resp) {
			        if (err){ res.sendStatus(err.code); }
			        res.json(resp);
			    });
			}
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

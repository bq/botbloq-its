'use strict';

var Students = require('./students.model.js'),
   config = require('../../res/config.js'), 
   async = require('async'),
   _ = require('lodash'),
   fs = require('fs'),
   functions = require('./students.functions.js'), 
functions2 = require('../courses/courses.functions.js'),
Courses = require('../courses/courses.model.js'),
LOMS = require('../loms/loms.model.js');


//ALL STUDENTS
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    Students.find({active: 1}, function (err, student) {
        if (err) res.sendStatus(err.code);
		res.json(student);
    });
};

/**
 * Creates a new element
 */
exports.create = function(req, res) {
    Students.create(req.body, function (err, student) {
        if (err) res.sendStatus(err.code);
        console.log('Student created!');
		
		var json_survey = require('../../res/learningstyle.json'); 
		json_survey.id_student = student._id;
		
		res.json(json_survey);
    });
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
    Students.findById(req.params.id, function(err, student) {
		var arrayCourses = [];
		if(functions.studentFound(student, req, res) == true){
			student.course.find(function(element, index, array){
				if(element.active == 1) arrayCourses.push(element);
			});
			student.course = arrayCourses;
			res.json(student);
		}
    });
};

/**
 * Updates a student by id
 */
exports.update = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
			if(functions.studentFound(student, req, res) == true) {
				student = _.extend(student, req.body);
				student.save(next);	
			}
		}	
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

/**
 * Includes a learning style in a student
 */
exports.init = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students,  req.params.id),
	    function(student, next) {
			if(functions.studentFound(student, req, res) == true){
				var answers = req.body.answers;
				for (var i = 0; i < answers.length; i++) { 
					switch(answers[i].id_question) {
					case "ls_comp":
		    			student.learningStyle.comprehension = answers[i].value;
		        		break;
		    		case "ls_input":
		   				student.learningStyle.input = answers[i].value;
		     			break;
		    		case "ls_per":
		    			student.learningStyle.perception = answers[i].value;
		   			 break;
		   			case "ls_proc":
		   				student.learningStyle.processing = answers[i].value;
		    			break;
		   			default:
		   			 	res.end("The id_question: " + answers[i].id_question + " is not correct")
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
	var newCourse= {idCourse: "", idSection: "", idLesson: "", idLom: "", status: 0, active: 1};
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
					if(course.length == 0){
						res.end('The course: ' + req.params.idc + ' is not registrated');
					} else {
					// If the course exists and the student is active
					// The course is assigned to the student
						if(functions.studentFound(student, req, res) == true){
							var coursed = false;
							student.course.find(function(element ,index , array){
								if(element.idCourse == req.params.idc){
									if (element.active == 1) 
										res.end('The student: ' + student._id + " is already enrolled in the course: " + req.params.idc);
									else 
										element.active = 1;
									activity = element;
									coursed = true;
								}
							});
							if(!coursed){ 
								course = course[0];
								if(course.sections.length <= 0){
									res.end('There are no sections to assign the student: ' + student._id);
								} else{
									newCourse.idCourse = course.name;
									newCourse.idSection = course.sections[0].name;
									if(!course.sections[0].lessons[0]){
										res.end('There are no lessons to assign the student: ' + student._id);
									} else {
										newCourse.idLesson = course.sections[0].lessons[0].name;
										if(!course.sections[0].lessons[0].loms[0]){
											res.end('There are no activities to assign the student: ' + student._id);
										} else{
											newCourse.idLom = course.sections[0].lessons[0].loms[0].lom_id;
											student.course.push(newCourse);
											LOMS.find({_id: newCourse.idLom}, function(err, lom) {
												if(err){
											        console.log(err);
											        res.status(err.code).send(err);
												} else{
													if(lom.length == 0){
														res.end('The lom: '+ newCourse.idLom + ' is not registrated');
													}
													 else {
														 console.log("Updated Student");
														 activity = lom[0];
													}
												}
											});
										}
									}
								}	
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
					if(functions.studentFound(student, req, res) == true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse == req.params.idc){
								coursed = true;
								element.active = 0;
								activity = element;
								student.save(next);
							}
						});
						if(!coursed) res.end('The student: ' + student._id 
							+ " is not enrolled in the course: " + req.params.idc);
					}
			    }
			});	
	    }
	], function(err, student) {
		functions.controlErrors(err, res, activity);
	});
}

/**
 * Updates the status of the lom for a student and a course
 */
exports.updateActivity = function (req, res) {
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
					if(functions.studentFound(student, req, res) == true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse == req.params.idc){
								if(element.active == 1){
									coursed = true;
									if (element.idLom == req.params.idl){
									
										if (req.params.status == "ok") element.status = 1;
										else { if (req.params.status == "nok") element.status = -1;												
										else res.end("the status: " + req.params.status + " is not correct"); }
									
										student.save(next);
									} else res.end("The student: " + student._id 
										+ " does not have the lom: " + req.params.idl);
								} else res.end("The student: " + student._id 
										+ " is not activated in the course: " + req.params.idc);
							}
						});
						
						if(!coursed) res.end("The student: " + student._id 
							+ " is not enrolled in the course: " + req.params.idc);
					} 
			    }
			});	
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

/**
 * Returns a new lom for a student and a course
 */
exports.newActivity = function (req, res) {
	var activity, lomRet = 0, indexLom = -1, indexLesson = -1, indexSection = -1,
	coursed = false, bool = false, arrayLoms, arrayLessons;
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
					if(course.length == 0){
						res.end('The course: ' + req.params.idc + ' is not registrated');
					} else {
						if(functions.studentFound(student, req, res) == true){
							student.course.find(function(element ,index , array){
								if(element.idCourse == req.params.idc){
									if(element.active == 1){
										coursed = true;
										course = course[0];
										indexSection = functions2.find_section(element.idSection, course.sections);	
										if(indexSection != -1){
											arrayLessons = course.sections[indexSection].lessons;
											indexLesson = functions2.find_lesson(element.idLesson, arrayLessons);
											if(indexLesson != -1){
												arrayLoms = course.sections[indexSection].lessons[indexLesson].loms;
												indexLom = functions2.find_lom(element.idLom, arrayLoms);
												if(indexLom != -1){
													if(arrayLoms.length > indexLom + 1){
														element.idLom = arrayLoms[indexLom + 1].lom_id;
													} else {
														if (arrayLessons.length > indexLesson + 1 && arrayLessons[indexLesson + 1].loms.length > 0){
															element.idLesson = arrayLessons[indexLesson + 1].name;
															element.idLom = arrayLessons[indexLesson + 1].loms[0].lom_id;
														} else{
															if (course.sections.length > indexSection + 1 && course.sections[indexSection+1].lessons[0].loms.length > 0 ){
																element.idSection = course.sections[indexSection+1].name;
																element.idLesson = course.sections[indexSection+1].lessons[0].name;
																element.idLom = course.sections[indexSection+1].lessons[0].loms[0].lom_id;
															} else {
																//res.end('The student has finished the course!!');
															}
														}
													}
												} else {
													res.end('The lesson does not have any lom in index: ' + indexLom);
												}
											} else {
												res.end('The section does not have any lesson in index: ' + indexLesson);
											}
										} else {
											res.end('The course does not have any section in index: ' + indexSection);
										}
										LOMS.find({_id: element.idLom}, function(err, lom) {
										    if (err) {
										        console.log(err);
										        res.status(404).send(err);
											} else {
							            		if(lom.length == 0) 
													res.end('The lom: ' + element.idLom + ' is not registrated');
												else {
													activity = lom[0];
													console.log('Student updated');
													student.save(next);					
												}
											}
										});	
									} else 	res.end("The student: " + student._id 
											+ " is not activated in the course: " + req.params.idc);			
								}
							});
							if(!coursed) res.end("The student: " + student._id 
								+ " is not enrolled in the course: " + req.params.idc);
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
 * Removes a element by id
 */
exports.remove = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
			if(!student)
				res.end("The student with id: " + req.params.id + " is not registrated");
			else{
			    Students.remove(student, function (err, resp) {
			        if (err) res.sendStatus(err.code);
			        res.json(resp);
			    });
			}
	    }
	], function(err, student) {
		functions.controlErrors(err, res, student);
	});
};

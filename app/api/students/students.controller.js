'use strict';

var Students = require('./students.model.js'),
   config = require('../../res/config.js'), 
   async = require('async'),
   _ = require('lodash');
   var fs = require('fs');
   var merge = require('merge');

//ALL STUDENTS
/**
 * Returns all elements
 */
exports.all = function (req, res) {
    Students.find({active: true}, function (err, student) {
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
        var id = student._id;

		var form = fs.readFileSync('/Users/Alvaro/Desktop/botbloq-its/app/res/learningstyle.json');           
        res.end('Added the student with id: ' + id + '\n'+ form);
    });
	
};

/**
 * Destroys all elements
 */
exports.destroy  = function(req, res){
    Students.remove({}, function (err, resp) {
        if (err) res.sendStatus(err.code);
        res.json(resp);
    });
};


//BY ID	
/**
 * Activates an student by ID
 */
exports.activate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: true});
	       	student.save(next);
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

/**
 * Deactivates an student by ID
 */
exports.deactivate = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
	        student = _.extend(student, {active: false});
	       	student.save(next);
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

/**
 * Returns an student by id
 */
exports.get = function (req, res) {
    Students.find({active: true, _id: req.params.id}, function (err, student) {
        if (err) res.sendStatus(err.code);
		res.json(student);
    });
};

/**
 * Updates a student by id
 */
exports.update = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students,  req.params.id),
	    function(student, next) {
			if(student.active == true) student = _.extend(student, req.body);
			student.save(next);
	
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

/**
 * Includes a learning style in a student
 */
exports.init = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students,  req.params.id),
	    function(student, next) {
			if(student.active == true){
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
			} else {
				console.log("The student with id: " + req.params.id + "is not activated")
			} 
			student.save(next);
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

/**
 * Enrollments a student by id in a course
 */
exports.enrollment = function (req, res) {
	var courseIndex = 0;
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
					// If the course exists and the student is active
					// The course is assigned to the student
					if(student.active == true){
						var coursed = false;
						student.course.find(function(element ,index , array){
							if(element.idCourse == req.params.idc){
								courseIndex = index;
								res.end('The student: ' + student._id + " is already enrolled in the course: " + req.params.idc);
								coursed = true;
							}
						});
						if(!coursed){ 
							student.course.push({idCourse: req.params.idc, status: 0});
						}
					} 
					student.save(next);					
			    }
			});	
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else { 
				var LOMS = require('../loms/loms.model.js');
				LOMS.find({}, function(err, loms) {
					// get all loms
				    if (err) {
				        console.log(err);
				        res.status(err.code).send(err);
					} else {
						// Returns the first lom tu the student
	            		if(!loms) res.end('There are no courses to assign the student: ' + student._id);
						else res.json(loms[0]);	
					}
				});			
	        }
	    }
	});
};

/**
 * Removes a element by id
 */
exports.remove = function (req, res) {
	async.waterfall([
	    Students.findById.bind(Students, req.params.id),
	    function(student, next) {
		    Students.remove(student, function (err, resp) {
		        if (err) res.sendStatus(err.code);
		        res.json(resp);
		    });
	    }
	], function(err, student) {
	    if (err) {
	        console.log(err);
	        res.status(err.code).send(err);
	    } else {
	        if (!student) {
	            res.sendStatus(404);
	        } else {
	            res.json(student);
	        }
	    }
	});
};

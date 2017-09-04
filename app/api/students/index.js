'use strict';
/* jshint node: true */


var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();



/////////////////////////////// GETs

// gets a specific lesson for the course
router.get('/:idstd/course/:idc/section/:ids/lesson/:idl', controller.getLesson); 

// returns true or false if the student is or is not enrolled in the course 
router.get('/:idstd/course/:idc/isEnrolled', controller.isEnrolled); 

// returns true or false if the student is or is not finished the course 
router.get('/:idstd/course/:idc/isFinished', controller.isFinished); 

// gets a new activity for the enrolled course
router.get('/:idstd/course/:idc', controller.newActivity); 

// login a student
router.get('/:name/password/:pass', controller.login); 

// gets a student knowledgeLevel
router.get('/:id/knowledge', controller.getKnowledge); 

// gets a list with course information of a student
router.get('/:id/:data', controller.dataCourses);

// gets a student
router.get('/:id', controller.get); 

// gets all students
router.get('/', controller.all);



//////////////////////////// POSTs

// includes learning style in a student
router.post('/:id/init', controller.init); 

// creates a student
router.post('/', controller.create); 


////////////////////////// LOCKs

// deactivates a course in a student
router.lock('/:idstd/course/:idc', controller.unenrollment);

// deactivates a student
router.lock('/:id', controller.deactivate);

 // activates a student
router.unlock('/:id', controller.activate);



/////////////////////////// PUTs

// Updates the status of the lom for a student and a course
router.put('/:idstd/course/:idc/lom/:idl/:status', controller.finalizeActivity);

// enrollments a student in a course
router.put('/:idstd/course/:idc', controller.enrollment); 

//rules test
router.put('/:id/group', controller.group);

// updates a student
router.put('/:id',  controller.update);




////////////////////////// DELETEs

 //deletes a student
router.delete('/:id',  controller.remove);

// destroys all students
router.delete('/',  controller.destroy);



module.exports = router;

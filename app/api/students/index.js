'use strict';

var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();



/////////////////////////////// GETs

// gets all students
router.get('/', controller.all);
 
// gets a student 
router.get('/:id', controller.get); 

router.get('/:idstd/course/:idc', controller.newActivity); 


//////////////////////////// POSTs

// creates a student
router.post('/', controller.create); 

// includes learning style in a student
router.post('/:id/init', controller.init); 



////////////////////////// LOCKs

 // activates a student
router.unlock('/:id', controller.activate)

// deactivates a student
router.lock('/:id', controller.deactivate) 



/////////////////////////// PUTs

// updates a student
router.put('/:id',  controller.update);

// enrollments a student in a course
router.put('/:idstd/course/:idc', controller.enrollment); 

// Updates the status of the lom for a student and a course
router.put('/:idstd/course/:idc/lom/:idl/:status', controller.updateActivity);




////////////////////////// DELETEs

// destroys all students
router.delete('/',  controller.destroy);

 //deletes a student
router.delete('/:id',  controller.remove);



module.exports = router;

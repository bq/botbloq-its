'use strict';

var express = require('express');
var controller = require('./courses.controller.js');
var section_ctrl = require('./sections.controller.js');

var router = express.Router();

/*
**************SECTIONS******************************
*/

// POSTs
router.post('/create_section', section_ctrl.create_section);
// router.post('/term/:term/location/:location', section_ctrl.prueba); // create a Section by the object
// router.get('/term/:term/location/:location', controller.prueba);
// router.post('/term/:courses/location/:sections', controller.create);

/*
**************COURSES******************************
*/

// GETs
router.get('/', controller.all); // list all courses
router.get('/:id', controller.get); // list the indicated course 

// POSTs
router.post('/', controller.create); // create a Course by the object

// PUTs
router.put('/update_field', controller.update_field); // update just one field of the course
router.put('/:id', controller.update); // update the whole course 

// DELETEs
router.delete('/:id', controller.remove);


module.exports = router;
'use strict';

var express = require('express');
var controller = require('./courses.controller.js');
var section_ctrl = require('./sections.controller.js');
var lesson_ctrl = require('./lessons.controller.js');

var router = express.Router();

/*
**************LESSONS******************************
*/

// GETs 
// list all lessons from a course section
router.get('/course/:course_id/section/:section_id/', lesson_ctrl.all_lessons); 
// list the indicated lesson
router.get('/course/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.get_lesson); 

// DELETEs a particular lesson of a section
router.delete('/course/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.delete_lesson);

// PUTs
router.put('/create_lesson', lesson_ctrl.create_lesson); // create a particular lesson of a section
router.put('/update_lesson', lesson_ctrl.update_lesson); // update a particular lesson of a section

/*
**************SECTIONS******************************
*/

// GETs
router.get('/course/:course_id', section_ctrl.all_sections); // list all sections from course
router.get('/course/:course_id/section/:section_id', section_ctrl.get_section); // list the indicated section

// DELETEs
router.delete('/course/:course_id/section/:section_id', section_ctrl.delete_section);

// PUTs
router.put('/create_section', section_ctrl.create_section);

// PUTs
router.put('/update_section_field', section_ctrl.update_section_field); // update a particular field 
	// of a section of a course
router.put('/update_section', section_ctrl.update_section); // update a particular section of a course


/*
***************COURSES******************************
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











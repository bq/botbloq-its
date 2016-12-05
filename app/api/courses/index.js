'use strict';

var express = require('express');
var controller = require('./courses.controller.js');
var section_ctrl = require('./sections.controller.js');
var lesson_ctrl = require('./lessons.controller.js');
var loms_ctrl = require('./loms.controller.js');

var router = express.Router();

/*
**************LOMS******************************
*/

// GETs 
// list all loms from a lesson
router.get('/:course_id/section/:section_id/lesson/:lesson_id/loms', loms_ctrl.all_loms);
// list the indicated lom
router.get('/:course_id/section/:section_id/lesson/:lesson_id/lom/:lom_id', loms_ctrl.get_lom); 

// DELETEs a particular lom of a lesson
router.delete('/delete_lom', loms_ctrl.delete_lom);

// PUTs
// create a particular lom of a lesson
router.put('/assign_lom', loms_ctrl.assign_lom);

/*
**************LESSONS******************************
*/

// GETs 
// list all lessons from a course section
router.get('/:course_id/section/:section_id/lessons', lesson_ctrl.all_lessons); 
// list the indicated lesson
router.get('/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.get_lesson); 

// DELETEs a particular lesson of a section
router.delete('/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.delete_lesson);

// PUTs
// create a particular lesson of a course section
router.put('/create_lesson', lesson_ctrl.create_lesson); 
// update a particular lesson of a course section
router.put('/update_lesson', lesson_ctrl.update_lesson); 
// update a particular field of lesson of a course section
router.put('/update_lesson_field', lesson_ctrl.update_lesson_field); 

/*
**************SECTIONS******************************
*/

// GETs
router.get('/:course_id/sections', section_ctrl.all_sections); // list all sections from course
router.get('/:course_id/section/:section_id', section_ctrl.get_section); // list the indicated section

// DELETEs
router.delete('/:course_id/section/:section_id', section_ctrl.delete_section);

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
//deletes a course by id
router.delete('/:id', controller.remove);
//deletes all courses
router.delete('/', controller.reset);

module.exports = router;











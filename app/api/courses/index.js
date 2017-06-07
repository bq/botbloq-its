'use strict';

var express = require('express');
var controller = require('./courses.controller.js');
var section_ctrl = require('./sections.controller.js');
var lesson_ctrl = require('./lessons.controller.js');
var loms_ctrl = require('./loms.controller.js');
var multer = require('multer');

var router = express.Router();
var upload = multer({ dest: '/tmp' });

/*
**************LOMS******************************
*/

// GETs 

// list the indicated lom
router.get('/:course_id/section/:section_id/lesson/:lesson_id/lom/:lom_id', loms_ctrl.get_lom); 

// list all loms from a lesson
router.get('/:course_id/section/:section_id/lesson/:lesson_id/loms', loms_ctrl.all_loms);


// POSTs

// create a particular lom of a lesson
router.post('/:idc/section/:ids/lesson/:idle/lom/:idlo', loms_ctrl.assign_lom);

// create a particular lom of a lesson
router.post('/:idc/section/:ids/lesson/:idle/assign_loms', loms_ctrl.assign_loms);

// DELETEs a list of loms of a lesson
router.delete('/:idc/section/:ids/lesson/:idle/delete_loms', loms_ctrl.delete_loms);
// DELETEs a particular lom of a lesson
router.delete('/:idc/section/:ids/lesson/:idle/lom/:idlo', loms_ctrl.delete_lom);


/*
**************LESSONS******************************
*/

// GETs 

// list the objectives of the indicated lesson
router.get('/:course_id/section/:section_id/lesson/:lesson_id/objectives', lesson_ctrl.get_lessonObjectives); 
// list the indicated lesson
router.get('/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.get_lesson); 
// list all lessons from a course section
router.get('/:course_id/section/:section_id/lessons', lesson_ctrl.all_lessons); 


// POSTs

// POSTs
router.post('/:idc/section/:ids/lesson/:idl/includePhoto',upload.single('file'), lesson_ctrl.includePhoto); // include a photo in a lesson
// create a particular lesson of a course section
router.post('/:idc/section/:ids', lesson_ctrl.create_lesson); 

// DELETEs a particular lesson of a section
router.delete('/:course_id/section/:section_id/lesson/:lesson_id', lesson_ctrl.delete_lesson);

// PUTs
// update a particular lesson of a course section
router.put('/:idc/section/:ids/lesson/:idl', lesson_ctrl.update_lesson); 


/*
**************SECTIONS******************************
*/

// GETs
router.get('/:course_id/section/:section_id/objectives', section_ctrl.get_sectionObjectives); // list the objectives of the indicated section

router.get('/:course_id/section/:section_id', section_ctrl.get_section); // list the indicated section

router.get('/:course_id/sections', section_ctrl.all_sections); // list all sections from course

// POSTs
router.post('/:id', section_ctrl.create_section);

// DELETEs

router.delete('/:course_id/section/:section_id', section_ctrl.delete_section);

// PUTs
// of a section of a course
router.put('/:idc/section/:ids', section_ctrl.update_section); // update a particular section of a course


/*
***************COURSES******************************
*/

// GETs
router.get('/:id/objectives', controller.getObjectives); // list the objectives of the indicated course 

router.get('/:id', controller.get); // list the indicated course 

router.get('/', controller.all); // list all courses


// POSTs
router.post('/:id/includePhoto',upload.single('file'), controller.includePhoto); // include a photo in a course

router.post('/', controller.create); // create a Course by the object

// PUTs
router.put('/:id', controller.update); // update the whole course 

// DELETEs
//deletes a course by id
router.delete('/:id', controller.remove);
//deletes all courses
router.delete('/', controller.reset);

module.exports = router;











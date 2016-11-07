'use strict';

var express = require('express');
var controller = require('./courses.controller.js');

var router = express.Router();

// GETs
router.get('/', controller.all); // list all courses
router.get('/:id', controller.get); // list the indicated course 

// POSTs
router.post('/', controller.create); // create a Course by the object

// PUTs
router.put('/Update', controller.update1);
router.put('/:id', controller.update);

// DELETEs
router.delete('/:id', controller.remove);


module.exports = router;
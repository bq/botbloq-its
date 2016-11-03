'use strict';

var express = require('express');
var controller = require('./courses.controller.js');

var router = express.Router();

// GETs
router.get('/', controller.all); // list all courses
router.get('/:id', controller.get); // list the indicated course 

// POSTs
router.post('/', controller.create);

// PUTs
router.put('/:id', controller.update);

// DELETEs
router.delete('/:id', controller.remove);


module.exports = router;

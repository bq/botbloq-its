'use strict';

var express = require('express');
var controller = require('./courses.controller.js');

var router = express.Router();

// GETs
router.get('/listCourses', controller.listCourses);

// BQ command examples

// HEADs
// router.head('/:email', controller.emailExists);

// GETs
// router.get('/:id', controller.show);

// POSTs
// router.post('/', controller.create);

// PUTs
// router.put('/me', controller.update);

// DELETEs
// router.delete('/:id', controller.destroy);


module.exports = router;

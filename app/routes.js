/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors/index');
var express = require('express');
var router = express.Router();

module.exports = function(app) {

    // Insert routes below
    //router.use('/example', require('./api/example/index'));
	router.use('/students', require('./api/students/index')); // students
	router.use('/courses', require('./api/courses/index')); // Courses
	router.use('/loms', require('./api/loms/index')); // Learning Object Metadata
	router.use('/files', require('./api/files/index')); // Learning Object Metadata
	
    // Set a prefix for all calls
    app.use('/botbloq/v1/its', router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};

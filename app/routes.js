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
	router.use('/students', require('./api/students/index'));
    // Set a prefix for all calls
    app.use('/botbloq/v1', router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};

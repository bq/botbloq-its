'use strict';

var Example = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	

var dat = {
		"name": "Course1",
		"content": "content1",
		"objetives": "objetives1",
		"bibliography": "bibliography1"
		}
	
/*
	List all courses
*/

exports.listCourses = function(req, res) {
	console.log( dat );
	res.end('Prueba' );
	}
	// res.send('Element: ' + elementId);


/**
 * Show a single profile element
 */
// exports.show = function(req, res) {

    // var elementId = req.params.id;

    // /**
     // * with bbdd connection
     // Example.findById(userId, function(err, element) {
        // if (err) {
            // res.status(500).send(err);
        // } else if (element) {
            // res.status(200).json(element.profile);
        // } else {
            // res.sendStatus(404);
        // }
    // });
     // */

    // res.send('Element: ' + elementId);
// };

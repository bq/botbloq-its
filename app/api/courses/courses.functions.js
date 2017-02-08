'use strict';

/**
 * These functions are called from other modules
 * If you want to call one of these functions, you need to add this line in yours file:
 * var ExampleFunctions = require('../../example.functions.js'),

var Example = require('./example.model.js'),
    config = require('../../res/config.js');

var myList = [];

 * Add element and increase its counter
 * @param {Object} element
 * @return {Function} next

exports.addElementInList = function(element, next) {
    myList.push(element);
    Example.increaseCounter(config.myNumber, next);
};
*/

var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    _ = require('lodash');

// Courses constants
// var OK200 = 200,
	// Created201 = 201,
	// NoContent204 = 204,
	// NotFound404 = 404,
	// Conflict409 = 409;

/*
Find the first course with the name indicated. Then
update the indicated field with the value 
*/
exports.update_field1 = function(courseId,field,value){
	Courses.findOne({name: courseId}, 
		function (err, course) {
			course[field] = value;
			course.save(function (err) {return err});
		}
	);
}

/*
returns the index position of the section or lesson identified by id
in the list of sections or lessons. If it doesn't exists in the list returns -1
*/

exports.exist_section_lesson = function (id,array){	
	var ret = -1;
	
	_.forEach(array, function(value){
		if(value.name === id) {
			ret = _.indexOf(array,value);
		}
	});
	return ret;
}

/*
returns the index position of the lom identified by lomId
in the list of loms. If it doesn't exists in the list returns -1
*/

exports.find_lom = function(lomId,loms){
	var ret = -1;
	
	_.forEach(loms, function(value){
		if(value.lom_id === lomId) {
			ret = _.indexOf(loms,value);
		}
	});
	return ret;
}

exports.controlErrors = function (err, res, ret){
    if (err) {
        console.log(err);
        res.sendStatus(err.code);
    } 
	else { 
		if(res.statusCode === 200){
			res.json(ret); 
		} else {
			res.sendStatus(res.statusCode);
		}
	}
}
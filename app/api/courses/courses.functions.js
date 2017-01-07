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
    config = require('../../res/config.js');

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
	Courses.findOne({'name' : courseId}, 
		function (err, course) {
			course[field] = value;
			course.save(function (err) {return err});
		}
	);
}

/*
returns the index position of the section identified by sectionId
in the list of sections. If it doesn't exists in the list returns -1
*/

exports.find_section = function(sectionId,sections){
	// verify that the 'new' section does not
	// already exists. In this case, it is an ERROR	
	var ret = -1;
	for (var i = 0 ; i < sections.length; i ++){
		if(sections[i].name === sectionId){
			ret = i;
		}
	}
	return ret;
}

/*
returns the index position of the lesson identified by lessonId
in the list of lessons. If it doesn't exists in the list returns -1
*/

exports.find_lesson = function(lessonId,lessons){
	// verify that the 'new' lesson does not
	// already exists. In this case, it is an ERROR	
	var ret = -1;
	for (var i = 0 ; i < lessons.length; i ++){
		if(lessons[i].name === lessonId){
			ret = i;
		}
	}
	return ret;
}

/*
returns the index position of the lom identified by lomId
in the list of loms. If it doesn't exists in the list returns -1
*/

exports.find_lom = function(lomId,loms){
	var ret = -1;
	for (var i = 0 ; i < loms.length; i ++){
		if(loms[i].lom_id === lomId){
			ret = i;
		}
	}
	return ret;
}
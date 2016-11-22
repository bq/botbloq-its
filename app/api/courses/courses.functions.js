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
	console.log('Updating course ',courseId);
	console.log('courseId,field',courseId,field);
	console.log('value\n',value);
	Courses.findOne({"name" : courseId}, 
		function (err, course) {
			console.log('course object',course);
			course[field] = value;
			console.log('new course body',course);
			course.save(function (err) {return err});
		}
	);
}

/*
returns the index position of the section identified by sectionId
in the list of sections. If it doesn't exists in the list returns -1
*/

exports.find_section = function(sectionId,sections){
	console.log('find the section index position. Otherwise -1',sectionId);
	console.log("sections\n",sections);	
	// verify that the 'new' section does not
	// already exists. In this case, it is an ERROR	
	console.log("sections",sections);
	var len = sections.length;
	for (var i = 0; i < len; i++) {		
		var elem = sections[i];
		console.log("elem ",i,"\n",elem);
		var cmp = sectionId.localeCompare(elem.name);
		console.log('comparing',cmp);
		if ( cmp === 0 ) 
			{ 
				console.log('string match');
				return i;
			}
	}
	return -1;
}

/*
returns the index position of the lesson identified by lessonId
in the list of lessons. If it doesn't exists in the list returns -1
*/

exports.find_lesson = function(lessonId,lessons){
	console.log('find the lesson index position. Otherwise -1',lessonId);
	console.log("lessons\n",lessons);	
	// verify that the 'new' lesson does not
	// already exists. In this case, it is an ERROR	
	console.log("lessons",lessons);
	var len = lessons.length;
	for (var i = 0; i < len; i++) {		
		var elem = lessons[i];
		console.log("elem ",i,"\n",elem);
		var cmp = lessonId.localeCompare(elem.name);
		console.log('comparing',cmp);
		if ( cmp === 0 ) 
			{ 
				console.log('string match');
				return i;
			}
	}
	return -1;
}

/*
returns the index position of the lom identified by lomId
in the list of loms. If it doesn't exists in the list returns -1
*/

exports.find_lom = function(lomId,loms){
	console.log('find the lom index position. Otherwise -1',lomId);
	console.log("loms\n",loms);
	var len = loms.length;
	for (var i = 0; i < len; i++) {		
		var elem = loms[i];
		console.log("elem ",i,"\n",elem);
		console.log("elem.lom_id",elem.lom_id);
		var cmp = lomId.localeCompare(elem.lom_id);
		console.log('comparing',cmp);
		if ( cmp === 0 ) 
			{ 
				console.log('string match');
				return i;
			}
	}
	return -1;
}
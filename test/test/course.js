'use strict';
var mongoose = require('mongoose');

var Course = function() {
	var currentDate = Date.now();

    this.generateRandomCourse = function() {
        var course = {
			name : "Test_Course_" + currentDate,
			code : "TEST"+ currentDate,
			content : "Default course for test with name without spaces"
		};
		return course;
	};

	this.generateDefaultSection = function() {
		var section = {
			course : "",
			section : {
				name : "section_1_1",
				resume : "Default Section",
				lessons: [] 
			} 
		}
		return section;
    };

	this.generateDefaultLesson = function() {
		var lesson = {
			course : "",
			section: "section_1_1",
			lesson : {
				name : "lesson_1_1",
				resume : "Default Lesson",
				los: [] 
			} 
		}
		return lesson;
    };

    this.generateAssignedLOM = function() {
    	var assignLOM = {
    		course : "",
    		section : "section_1_1",
    		lesson : "lesson_1_1",
    		lom_id : ""
    	};
    	return assignLOM;
    }

}

module.exports = Course;
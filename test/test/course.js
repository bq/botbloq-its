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
				name : "Section_1_1",
				resume : "Default Section",
				lessons: [] 
			} 
		}
		return section;
    };

	this.generateDefaultLesson = function() {
		var lesson = {
			course : "",
			section: "Section_1_1",
			lesson : {
				name : "Lesson_1_1",
				resume : "Default Lesson",
				loms: [] 
			} 
		}
		return lesson;
    };

    this.generateAssignedLOM = function() {
    	var assignLOM = {
    		course : "",
    		section : "Section_1_1",
    		lesson : "Lesson_1_1",
    		lom_id : ""
    	};
    	return assignLOM;
    }
	
	this.generateCompleteCourse = function(loms){
		var course = {
			name: "courseComplete" + currentDate,
			code: "COURSE" + currentDate,
			content: "Complete course for test",
			sections: [
				{
					name: "Section_1_1",
					resume: "Default section",
					lessons: [
						{
							name: "Lesson_1_1",
							resume: "Default lesson 1",
							learning_path: {
								ok: [2],
								nok: [1]
							},
							loms: [{lom_id: loms[0]}]
						},
						{
							name: "Lesson_1_2",
							resume: "Default lesson 2",
							learning_path: {
								ok: [2],
								nok: [2]
							},
							loms: [{lom_id: loms[1]}]
						},
						{
							name: "Lesson_1_3",
							resume: "Default lesson 3",
							learning_path: {
								ok: [2],
								nok: []
							},
							loms: [{lom_id: loms[2]}]
						}
					]
				}
			]	
		}
		return course;
	}
	
	this.generateZowiCourse = function(loms) {
		var course = {
			name: "courseZowi" + currentDate,
			code: "COURSE" + currentDate,
			content: "Zowi course for test",
			sections: [
				{
					name: "Section_1_1",
					resume: "Default section",
					lessons: [
						{
							name: "Lesson_0_0",
							resume: "initial lesson",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[0]}]
						},
						{
							name: "Lesson_0_1",
							resume: "Zowi charla con gato",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[1]}]
						},
						{
							name: "Lesson_0_2",
							resume: "Zowi camina por la lluvia",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[2]}]
						},
						
						{
							name: "Lesson_0_3",
							resume: "Moviendo a Zowi",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[3]}]
						},
						{
							name: "Lesson_0_4",
							resume: "Un murcielago persigue a Zowi",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[4]}]
						},
						{
							name: "Lesson_0_5",
							resume: "Zowi se alimenta",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[5]}]
						},
						
						{
							name: "Lesson_0_6",
							resume: "¿Cuantas manzanas te has comido Zowi?",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[6]}]
						},
						{
							name: "Lesson_0_7",
							resume: "¡¡Lueve!!",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[7]}]
						},
						{
							name: "Lesson_0_8",
							resume: "Zowi pesca",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[8]}]
						},
						{
							name: "Lesson_0_9",
							resume: "Zowi enciende la luz",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[9]}]
						},
						{
							name: "Lesson_1_0",
							resume: "Zowi se ha vuelto un listillo",
							learning_path: {
								ok: [],
								nok: []
							},
							loms: [{lom_id: loms[10]}]
						}
					]
				}
			]	
		}
		return course;
	}

}

module.exports = Course;
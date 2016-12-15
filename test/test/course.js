'use strict';
var mongoose = require('mongoose');

var Course = function() {
	var currentDate = Date.now();

    this.generateRandomCourse = function() {
        var course = {
			name : 'Test_Course_' + currentDate,
			code : 'TEST'+ currentDate,
			content : 'Default course for test with name without spaces'
		};
		return course;
	};

	this.generateDefaultSection = function() {
		var section = {
			course : '',
			section : {
				name : 'Section_1_1',
				resume : 'Default Section',
				lessons: [] 
			} 
		}
		return section;
    };

	this.generateDefaultLesson = function() {
		var lesson = {
			course : '',
			section: 'Section_1_1',
			lesson : {
				name : 'Lesson_1_1',
				resume : 'Default Lesson',
				loms: [] 
			} 
		}
		return lesson;
    };

    this.generateAssignedLOM = function() {
    	var assignLOM = {
    		course : '',
    		section : 'Section_1_1',
    		lesson : 'Lesson_1_1',
    		lom_id : ''
    	};
    	return assignLOM;
    }
	
	this.generateCompleteCourse = function(loms){
		var course = {
			name: 'courseZowi' + currentDate,
			code: 'COURSE' + currentDate,
			content: 'Zowi course for test',
			sections: [
				{
					name: 'Section_1_1',
					resume: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							resume: 'Default lesson 1',
							learning_path: [2,1],
							type: 'Essential',
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							resume: 'Default lesson 2',
							learning_path: [2],
							type: 'Extension',
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_3',
							resume: 'Default lesson 3',
							learning_path: [2],
							type: 'Reinforcement',
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
			name: 'courseZowi' + currentDate,
			code: 'COURSE' + currentDate,
			content: 'Zowi course for test',
			sections: [
				{
					name: 'Section_1_1',
					resume: 'Default section',
					lessons: [
						{
							name: 'Lesson_0_0',
							resume: 'initial lesson',
							learning_path: [],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_0_1',
							resume: 'Zowi charla con gato',
							learning_path: [],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_0_2',
							resume: 'Zowi camina por la lluvia',
							learning_path: [],
							loms: [{lom_id: loms[2]}]
						},
						
						{
							name: 'Lesson_0_3',
							resume: 'Moviendo a Zowi',
							learning_path: [],
							loms: [{lom_id: loms[3]}]
						},
						{
							name: 'Lesson_0_4',
							resume: 'Un murcielago persigue a Zowi',
							learning_path: [],
							loms: [{lom_id: loms[4]}]
						},
						{
							name: 'Lesson_0_5',
							resume: 'Zowi se alimenta',
							learning_path: [],
							loms: [{lom_id: loms[5]}]
						},
						
						{
							name: 'Lesson_0_6',
							resume: '¿Cuantas manzanas te has comido Zowi?',
							learning_path: [],
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_0_7',
							resume: '¡¡Lueve!!',
							learning_path: [],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_0_8',
							resume: 'Zowi pesca',
							learning_path: [],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_0_9',
							resume: 'Zowi enciende la luz',
							learning_path: [],
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_1_0',
							resume: 'Zowi se ha vuelto un listillo',
							learning_path: [],
							loms: [{lom_id: loms[10]}]
						}
					]
				}
			]	
		}
		return course;
	}
	
	this.generateBitbloqCourse = function(loms){

		var course = {
			name: 'courseBitbloq' + currentDate,
			code: 'COURSE' + currentDate,
			content: 'Bitbloq course for test',
			sections: [
				{
					name: 'Section_1',
					resume: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							resume: 'Antes de empezar',
							learning_path: [1],
							type: 'Essential',
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							resume: 'Conociendo el entorno',
							learning_path: [2],
							type: 'Essential',
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_3',
							resume: '¿Que es un robot?',
							learning_path: [5],
							type: 'Essential',
							loms: [{lom_id: loms[2]}]
						},
						{
							name: 'Lesson_4',
							resume: 'LED',
							learning_path: [9, 4],
							type: 'Reinforcement',
							loms: [{lom_id: loms[3]}]
						},
						{
							name: 'Lesson_5',
							resume: 'Condicionales',
							learning_path: [6, 10],
							type: 'Essential',
							loms: [{lom_id: loms[4]}]
						},
						{
							name: 'Lesson_8',
							resume: 'Algoritmos',
							learning_path: [3, 4],
							type: 'Essential',
							loms: [{lom_id: loms[5]}]
						},
						{
							name: 'Lesson_9',
							resume: 'Zumbador',
							learning_path: [7, 10],
							type: 'Reinforcement',
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_10',
							resume: 'Sensor IR',
							learning_path: [8, 10],
							type: 'Reinforcement',
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_12',
							resume: 'Sensor luz',
							learning_path: [10],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_15',
							resume: 'Servo rotacion continua',
							learning_path: [4],
							type: 'Reinforcement',
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_20',
							resume: 'Logica booleana',
							learning_path: [10],
							type: 'Extension',
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
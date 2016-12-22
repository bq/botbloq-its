'use strict';
var mongoose = require('mongoose');

var Course = function() {
	var currentDate = Date.now();

    this.generateRandomCourse = function() {
        var course = {
			name : 'Test_Course_' + currentDate,
			code : 'TEST'+ currentDate,
			summary : 'Default course for test with name without spaces'
		};
		return course;
	};

	this.generateDefaultSection = function() {
		var section = {
			course : '',
			section : {
				name : 'Section_1_1',
				summary : 'Default Section',
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
				summary : 'Default Lesson',
				loms: [] 
			},
			objectives: []
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
			summary: 'Zowi course for test',
			sections: [
				{
					name: 'Section_1_1',
					summary: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Default lesson 1',
							learning_path: [2,1],
							type: 'Essential',
							objectives: [],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							summary: 'Default lesson 2',
							learning_path: [2],
							type: 'Extension',
							objectives: [],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_3',
							summary: 'Default lesson 3',
							learning_path: [2],
							type: 'Reinforcement',
							objectives: [],
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
			summary: 'Zowi course for test',
			sections: [
				{
					name: 'Section_1_1',
					summary: 'Default section',
					lessons: [
						{
							name: 'Lesson_0_0',
							summary: 'initial lesson',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_0_1',
							summary: 'Zowi charla con gato',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_0_2',
							summary: 'Zowi camina por la lluvia',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[2]}]
						},
						
						{
							name: 'Lesson_0_3',
							summary: 'Moviendo a Zowi',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[3]}]
						},
						{
							name: 'Lesson_0_4',
							summary: 'Un murcielago persigue a Zowi',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[4]}]
						},
						{
							name: 'Lesson_0_5',
							summary: 'Zowi se alimenta',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[5]}]
						},
						
						{
							name: 'Lesson_0_6',
							summary: '¿Cuantas manzanas te has comido Zowi?',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_0_7',
							summary: '¡¡Lueve!!',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_0_8',
							summary: 'Zowi pesca',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_0_9',
							summary: 'Zowi enciende la luz',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_1_0',
							summary: 'Zowi se ha vuelto un listillo',
							learning_path: [],
							objectives: [],
							loms: [{lom_id: loms[10]}]
						}
					]
				}
			]	
		}
		return course;
	}
	
	this.generateBitbloqIntroduction = function(loms){

		var course = {
			name: 'courseIntroduction' + currentDate,
			code: 'INTRO' + currentDate,
			summary: 'Bitbloq introduction for test',
			sections: [
				{
					name: 'Section_1',
					summary: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Antes de empezar',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 1,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							summary: 'Conociendo el entorno',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 1,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[1]}]
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
			summary: 'Bitbloq  course for test',
			sections: [
				{
					name: 'Section_1',
					summary: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Antes de empezar',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 1,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							summary: 'Conociendo el entorno',
							learning_path: [2],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 1,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_3',
							summary: '¿Que es un robot?',
							learning_path: [5],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[2]}]
						},
						{
							name: 'Lesson_4',
							summary: 'LED',
							learning_path: [9, 4],
							type: 'Reinforcement',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[3]}]
						},
						{
							name: 'Lesson_5',
							summary: 'Condicionales',
							learning_path: [6, 10],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[4]}]
						},
						{
							name: 'Lesson_8',
							summary: 'Algoritmos',
							learning_path: [3, 4],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[5]}]
						},
						{
							name: 'Lesson_9',
							summary: 'Zumbador',
							learning_path: [7, 10],
							type: 'Reinforcement',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_10',
							summary: 'Sensor IR',
							learning_path: [8, 10],
							type: 'Reinforcement',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_12',
							summary: 'Sensor luz',
							learning_path: [10],
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_15',
							summary: 'Servo rotacion continua',
							learning_path: [4],
							type: 'Reinforcement',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_20',
							summary: 'Logica booleana',
							learning_path: [10],
							type: 'Extension',
							objectives: [{
								code: 'ROBOT01',
								description: '',
								level: 2,
								bloom:'knoweldge'
							}],
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
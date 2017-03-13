'use strict';
var mongoose = require('mongoose');

var Course = function() {
	var currentDate = Date.now();

    this.generateRandomCourse = function() {
        var course = {
			name : 'Test_Course_' + currentDate,
			code : 'TEST'+ currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary : 'Default course',
			sections: []
		};
		return course;
	};
	
    this.generateRandomCourse2 = function(nameCourse, codeCourse) {
        var course = {
			name : nameCourse,
			code : codeCourse,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary : 'Default course',
			sections: []
			
		};
		return course;
	};

	this.generateDefaultSection = function() {
		var section = {
				name : 'Section_1_1',
				summary : 'Section summary',
				lessons: [] 
			};
		return section;
    };

	this.generateDefaultLesson = function() {
		var lesson = {
				name : 'Lesson_1_1',
				summary : 'Lesson summary',
				loms: [],
				objectives: [{
					code: 'CODE01',
					description: 'objective for test',
					level: 1,
					bloom: 'knowledge'
				}]
			};
		return lesson;
    };
	
	this.generateCompleteCourse = function(loms){
		var course = {
			name: 'course_Zowi_partial',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Zowi course',
			sections: [
				{
					name: 'Section_1_1',
					summary: 'Main section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Zowi Lesson 1',
							learning_path: [2,1],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_2',
							summary: 'Zowi Lesson 2',
							learning_path: [2],
							type: 'Extension',
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_3',
							summary: 'Zowi Lesson 3',
							learning_path: [2],
							type: 'Reinforcement',
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
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
			name: 'course_Zowi_complete',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled: [],
				std_finished: [],
				std_unenrolled: []
			},
			summary: 'Zowi course',
			sections: [
				{
					name: 'Section_1_1',
					summary: 'Main section',
					lessons: [
						{
							name: 'Lesson_0_0',
							summary: 'initial lesson',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[0]}]
						},
						{
							name: 'Lesson_0_1',
							summary: 'Zowi charla con gato',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[1]}]
						},
						{
							name: 'Lesson_0_2',
							summary: 'Zowi camina por la lluvia',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[2]}]
						},
						
						{
							name: 'Lesson_0_3',
							summary: 'Moviendo a Zowi',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[3]}]
						},
						{
							name: 'Lesson_0_4',
							summary: 'Un murcielago persigue a Zowi',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[4]}]
						},
						{
							name: 'Lesson_0_5',
							summary: 'Zowi se alimenta',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[5]}]
						},
						
						{
							name: 'Lesson_0_6',
							summary: '¿Cuantas manzanas te has comido Zowi?',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_0_7',
							summary: '¡¡Lueve!!',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_0_8',
							summary: 'Zowi pesca',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_0_9',
							summary: 'Zowi enciende la luz',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_1_0',
							summary: 'Zowi se ha vuelto un listillo',
							learning_path: [],
							objectives: [{
								code: 'ROBOT02',
								description: 'Advanced concepts on robotics',
								level: 1,
								bloom: 'knowledge'
							}],
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
			name: 'course_Bitbloq_introduction',
			code: 'INTRO' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Bitbloq introduction',
			sections: [
				{
					name: 'Section_1',
					summary: 'Main section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Antes de empezar',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 1,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 1,
								bloom:'knowledge'
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
			name: 'course_Bitbloq_complete',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Bitbloq  course',
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
								description: 'Basic Concepts on Robotics',
								level: 1,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 1,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_12',
							summary: 'Sensor luz',
							learning_path: [10],
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
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
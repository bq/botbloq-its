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
				objectives : [],
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
							dificulty: 0,
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
							dificulty: 0,
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
							dificulty: 0,
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
							loms: [{lom_id: loms[0], type: 'video'}]
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
							loms: [{lom_id: loms[1], type: 'video'}]
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
							loms: [{lom_id: loms[2], type: 'video'}]
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
							dificulty: 0,
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
							dificulty: 0,
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
			name: 'course_Bitbloq_partial',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Bitbloq course partial',
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
							dificulty: 0,
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
							dificulty: 1,
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
							dificulty: 2,
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
							dificulty: 0,
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
							dificulty: 2,
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
							dificulty: 1,
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
							dificulty: 0,
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
							dificulty: 0,
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
							type: 'Reinforcement',
							dificulty: 1,
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
							dificulty: 1,
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
							dificulty: 2,
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

	this.generateCompleteBitbloqCourse = function(loms){

		var course = {
			name: 'course_Bitbloq_complete',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Bitbloq course complete',
			sections: [
				{
					name: 'Section_1',
					summary: 'Default section',
					lessons: [
						{
							name: 'Lesson_1',
							summary: 'Antes de empezar',
							learning_path: [2],
							type: 'Essential',
							dificulty: 0,
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
							learning_path: [7],
							type: 'Essential',
							dificulty: 0,
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
							learning_path: [1],
							type: 'Essential',
							dificulty: 0,
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
							learning_path: [14, 4],
							type: 'Reinforcement',
							dificulty: 1,
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
							learning_path: [8, 9, 11 ,19, 6],
							dificulty: 0,
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
							name: 'Lesson_6',
							summary: 'Puerto serie',
							learning_path: [12],
							dificulty: 0,
							type: 'Extension',
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[5]}]
						},
						{
							name: 'Lesson_7',
							summary: 'Variables',
							learning_path: [10, 13, 5, 16, 12],
							type: 'Essential',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[6]}]
						},
						{
							name: 'Lesson_8',
							summary: 'Algoritmos',
							learning_path: [3, 14, 4],
							type: 'Essential',
							dificulty: 1,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[7]}]
						},
						{
							name: 'Lesson_9',
							summary: 'Zumbador',
							learning_path: [9, 11, 19, 6],
							type: 'Reinforcement',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[8]}]
						},
						{
							name: 'Lesson_10',
							summary: 'Sensor IR',
							learning_path: [8, 11, 19, 6],
							type: 'Reinforcement',
							dificulty: 1,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[9]}]
						},
						{
							name: 'Lesson_11',
							summary: 'Potenciometro (mapear)',
							learning_path: [13, 5, 16, 12],
							type: 'Reinforcement',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[10]}]
						},
						{
							name: 'Lesson_12',
							summary: 'Sensor luz',
							learning_path: [8, 9, 19, 6],
							type: 'Reinforcement',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[11]}]
						},
						{
							name: 'Lesson_13',
							summary: 'Bucles',
							learning_path: [15, 23, 17],
							type: 'Essential',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[12]}]
						},
						{
							name: 'Lesson_14',
							summary: 'Miniservo (mapear)',
							learning_path: [10, 5, 16, 12],
							type: 'Reinforcement',
							dificulty: 1,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[13]}]
						},
						{
							name: 'Lesson_15',
							summary: 'Servo rotacion continua',
							learning_path: [3, 4],
							type: 'Reinforcement',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[14]}]
						},
						{
							name: 'Lesson_16',
							summary: 'Maquina de estados',
							learning_path: [23, 17],
							type: 'Extension',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[15]}]
						},
						{
							name: 'Lesson_17',
							summary: 'Sensor de ultrasonidos',
							learning_path: [10, 13, 6, 12],
							type: 'Reinforcement',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[16]}]
						},
						{
							name: 'Lesson_18',
							summary: 'Funciones sin retorno',
							learning_path: [22, 18, 20, 21],
							type: 'Essential',
							dificulty: 1,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[17]}]
						},
						{
							name: 'Lesson_19',
							summary: 'Funciones con retorno',
							learning_path: [22, 20, 21],
							type: 'Extension',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[18]}]
						},
						{
							name: 'Lesson_20',
							summary: 'Logica booleana',
							learning_path: [6],
							type: 'Extension',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[19]}]
						},
						{
							name: 'Lesson_21',
							summary: 'LCD',
							learning_path: [22, 18, 21],
							type: 'Extension',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[20]}]
						},
						{
							name: 'Lesson_22',
							summary: 'Joystick (Arrays)',
							learning_path: [22, 18, 20],
							type: 'Extension',
							dificulty: 0,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[21]}]
						},
						{
							name: 'Lesson_23',
							summary: 'Melodias',
							learning_path: [18, 20, 21],
							type: 'Essential',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[22]}]
						},
						{
							name: 'Lesson_24',
							summary: 'Botonera',
							learning_path: [15, 17],
							type: 'Extension',
							dificulty: 2,
							objectives: [{
								code: 'ROBOT01',
								description: 'Basic Concepts on Robotics',
								level: 2,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[23]}]
						}
					]	
				}
			]
		}
		return course;
	}

	this.generateComplexCourse = function(loms, types){

		var course = {
			name: 'complex_course',
			code: 'COMPLEX' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Complex course to test loms types',
			sections: [
				{
					name: 'Section_Complex_1',
					summary: 'Main section',
					lessons: [
						{
							name: 'Lesson_Complex_1',
							summary: 'First complex lesson',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'COMPLEX01',
								description: 'complex concepts',
								level: 1,
								bloom:'knowledge'
							}],
							loms: [
									{lom_id: loms[1], type: types[1]},
									{lom_id: loms[2], type: types[2]},
									{lom_id: loms[3], type: types[3]}]
						},
						{
							name: 'Lesson_Complex_2',
							summary: 'Second complex lesson',
							learning_path: [1],
							type: 'Essential',
							objectives: [{
								code: 'COMPLEX01',
								description: 'complex concepts',
								level: 1,
								bloom:'knowledge'
							}],
							loms: [{lom_id: loms[4], type: types[4]},
									{lom_id: loms[5], type: types[5]},
									{lom_id: loms[6], type: types[6]},
									{lom_id: loms[7], type: types[7]}]
						}
					]	
				}
			]
		}
		return course;
	}
}

module.exports = Course;
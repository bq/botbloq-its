'use strict';
var mongoose = require('mongoose');

var Course = function() {
	var currentDate = Date.now();

    this.generateRandomCourse = function() {
        var course = {
			name : 'Curso de Prueba' + currentDate,
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
				title : 'Lesson title',
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
			name: 'Curso Zowi',
			code: 'COURSE' + currentDate,
			statistics: {
				std_enrolled : [],
				std_finished : [],
				std_unenrolled : []
			},
			summary: 'Curso de Zowi',
			sections: [
				{
					name: 'Section_1_1',
					summary: 'Main section',
					lessons: [
						{
							name: 'Lesson_1',
							title: 'Zowi Lesson 1',
							learning_path: [3,2],
							type: 'Essential',
							difficulty: 0,
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
							title: 'Zowi Lesson 2',
							learning_path: [3],
							type: 'Extension',
							difficulty: 0,
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
							title: 'Zowi Lesson 3',
							learning_path: [3],
							type: 'Reinforcement',
							difficulty: 0,
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
			name: 'Curso de Scratch con Zowi',
			code: 'COURSE' + currentDate,
			photo: 'http://diwo.bq.com/wp-content/uploads/2015/11/zowi-destacado.jpg',
			author: 'q3',
			statistics: {
				std_enrolled: [],
				std_finished: [],
				std_unenrolled: []
			},
			summary: 'Con éste curso aprenderás a usar Scratch, pero lo realmente emocionante viene después. Cuando aprendas cómo pensar a la hora de programar ¡podrás realizar alucinantes videojuegos y animaciones! Intenta desarrollar tus propias ideas y terminar tus propios proyectos',
			sections: [
				{
					name: '1',
					summary: 'Sección única',
					lessons: [
						{
							name: '1',
							title: 'Scratch: Zowi charla con el gato',
							description: 'Aprende a cargar fondos y personajes en Scratch',
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
							name: '2',
							title: 'Scratch: Zowi camina por la luna',
							description: 'Aprende a mover Zowi utilizando las flechas de tu teclado',
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
							name: '3',
							title: 'Scratch: moviendo a Zowi',
							description: 'Mueve a Zowi usando el raton y modifica su tamaño para que parezca que está lejos o más cerca',
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
							title: 'Antes de empezar',
							learning_path: [2],
							difficulty: 0,
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
							title: 'Conociendo el entorno',
							learning_path: [2],
							difficulty: 0,
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
							title: 'Antes de empezar',
							learning_path: [2],
							type: 'Essential',
							difficulty: 0,
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
							title: 'Conociendo el entorno',
							learning_path: [3],
							type: 'Essential',
							difficulty: 1,
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
							title: '¿Que es un robot?',
							learning_path: [6],
							type: 'Essential',
							difficulty: 2,
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
							title: 'LED',
							learning_path: [10, 5],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Condicionales',
							learning_path: [7, 11],
							difficulty: 2,
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
							title: 'Algoritmos',
							learning_path: [4, 5],
							type: 'Essential',
							difficulty: 1,
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
							title: 'Zumbador',
							learning_path: [8, 11],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Sensor IR',
							learning_path: [9, 11],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Sensor luz',
							learning_path: [11],
							type: 'Reinforcement',
							difficulty: 1,
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
							title: 'Servo rotacion continua',
							learning_path: [5],
							type: 'Reinforcement',
							difficulty: 1,
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
							title: 'Logica booleana',
							learning_path: [11],
							type: 'Extension',
							difficulty: 2,
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
							title: 'Antes de empezar',
							learning_path: [3],
							type: 'Essential',
							difficulty: 0,
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
							title: 'Conociendo el entorno',
							learning_path: [8],
							type: 'Essential',
							difficulty: 0,
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
							title: '¿Que es un robot?',
							learning_path: [2],
							type: 'Essential',
							difficulty: 0,
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
							title: 'LED',
							learning_path: [15, 5],
							type: 'Reinforcement',
							difficulty: 1,
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
							title: 'Condicionales',
							learning_path: [9, 10, 12 ,20, 7],
							difficulty: 0,
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
							title: 'Puerto serie',
							learning_path: [13],
							difficulty: 0,
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
							title: 'Variables',
							learning_path: [11, 14, 6, 17, 13],
							type: 'Essential',
							difficulty: 0,
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
							title: 'Algoritmos',
							learning_path: [4, 15, 5],
							type: 'Essential',
							difficulty: 1,
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
							title: 'Zumbador',
							learning_path: [10, 12, 20, 7],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Sensor IR',
							learning_path: [9, 12, 20, 7],
							type: 'Reinforcement',
							difficulty: 1,
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
							title: 'Potenciometro (mapear)',
							learning_path: [14, 6, 17, 13],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Sensor luz',
							learning_path: [9, 10, 20, 7],
							type: 'Reinforcement',
							difficulty: 2,
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
							title: 'Bucles',
							learning_path: [16, 24, 18],
							type: 'Essential',
							difficulty: 2,
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
							title: 'Miniservo (mapear)',
							learning_path: [11, 6, 17, 13],
							type: 'Reinforcement',
							difficulty: 1,
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
							title: 'Servo rotacion continua',
							learning_path: [4, 5],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Maquina de estados',
							learning_path: [24, 18],
							type: 'Extension',
							difficulty: 0,
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
							title: 'Sensor de ultrasonidos',
							learning_path: [11, 14, 7, 13],
							type: 'Reinforcement',
							difficulty: 0,
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
							title: 'Funciones sin retorno',
							learning_path: [23, 19, 21, 22],
							type: 'Essential',
							difficulty: 1,
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
							title: 'Funciones con retorno',
							learning_path: [23, 21, 22],
							type: 'Extension',
							difficulty: 2,
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
							title: 'Logica booleana',
							learning_path: [7],
							type: 'Extension',
							difficulty: 2,
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
							title: 'LCD',
							learning_path: [23, 19, 22],
							type: 'Extension',
							difficulty: 0,
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
							title: 'Joystick (Arrays)',
							learning_path: [23, 19, 21],
							type: 'Extension',
							difficulty: 0,
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
							title: 'Melodias',
							learning_path: [19, 21, 22],
							type: 'Essential',
							difficulty: 2,
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
							title: 'Botonera',
							learning_path: [16, 18],
							type: 'Extension',
							difficulty: 2,
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
							title: 'First complex lesson',
							learning_path: [2],
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
							title: 'Second complex lesson',
							learning_path: [2],
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
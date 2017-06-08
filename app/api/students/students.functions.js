'use strict';
var functions2 = require('../courses/courses.functions.js');
var Courses = require('../courses/courses.model.js');
var _ = require('lodash');
var LOMS = require('../loms/loms.model.js');
var mongoose = require('mongoose');
var RuleEngine = require('node-rules');

var studentType = [[], ['beginner','beginner','medium'], ['beginner','medium','medium'], 
					['medium','medium','medium'], ['medium','advanced','advanced'], 
					['advanced','advanced','advanced'], ['medium','medium','advanced'], 
					['beginner','beginner','medium']];


var beginnerTable = {bad: ['beginner', 'beginner', 'beginner'], 
					normal: ['beginner', 'beginner', 'beginner'],
					good: ['medium', 'medium', 'beginner']};

var mediumTable = {bad: ['beginner', 'beginner', 'beginner'], 
					normal: ['medium', 'medium', 'medium'], 
					good: ['advanced', 'advanced', 'medium']};

var advancedTable = {bad: ['medium', 'medium', 'medium'], 
					normal: ['advanced', 'advanced', 'medium'], 
					good: ['advanced', 'advanced', 'advanced']};


var rules = require('../../res/rules.json');
var ruleEngineGR = new RuleEngine();
ruleEngineGR.fromJSON(rules);

/**
 *  Controls callback errors and shows the solution
 */
exports.controlErrors = function (err, res, ret){
    if (err) {
        console.log(err);
        res.status(err.code).send(err);
    } 
	else{ 
		if(res.statusCode === 200){
			res.json(ret); 			
		}
	}
}

/**
 *	This function returns all courses completed by the student
 */
exports.getCoursesDone = function(student, courses){
	var coursesDone = [];
	
	for(var i = 0; i < courses.length; i++ ){
		for(var j = 0; j < courses[i].statistics.std_finished.length; j++){
			if(student._id.equals(courses[i].statistics.std_finished[j])){
				coursesDone.push(courses[i]._id);
			}
		}
	}
	return coursesDone;

}

/**
 *	This function returns all courses completed by the student
 */
exports.getCoursesNotDone = function(student, courses){
	var coursesDone = [], coursesNotDone = [];
	
	for(var i = 0; i < courses.length; i++ ){
		for(var j = 0; j < courses[i].statistics.std_finished.length; j++){
			if(student._id.equals(courses[i].statistics.std_finished[j])){
				coursesDone.push(courses[i]._id);
			}
		}
		if(coursesDone.indexOf(courses[i]._id) === -1){
			coursesNotDone.push(courses[i]._id);
		}
	}
	return coursesNotDone;

}

/**
 *	Returns all active student courses
 */
exports.getActiveCourses = function(student){
	var activeCourses = [];
	for (var i = 0; i < student.course.length; i++){
		if(student.course[i].active === 1) {
			activeCourses.push(student.course[i].idCourse);
		}
	} 
	return activeCourses;
}

/**
 *	Returns lasts courses included
 */
exports.getLastCourses = function(student, courses){
	var lastCourses = [];

	courses.sort(function(a, b){
		return (b.createdAt - a.createdAt);
	});

	_.forEach(courses, function(key){
		lastCourses.push(key._id);
	});

	if(lastCourses.length > 3){
		return lastCourses.slice(0, 0+3);
	} else {
		return lastCourses;
	}
}

/**
 *	Returns related courses to the student
 */
exports.getRelatedCourses = function(student, courses){
	var relatedCourses = [], bool = true;

	_.forEach(courses, function(course){
		var indl = 0, inds = 0;
		while(bool === true){

			if(student.knowledgeLevel.length > inds){
				if(course.sections.length > 0){
					if(course.sections[0].lessons[indl].objectives[0].code === student.knowledgeLevel[inds].code){
						relatedCourses.push(course._id);
						bool = false;
					} else {
						inds++;
					}
				} else {
					bool = false;
				}
			} else {
				inds = 0;
				if(course.sections[0].lessons.length > indl){
					indl++;
				} else {
					bool = false;
				}
			}
		}
		bool = true;

	});

	return relatedCourses;
}

/**
 *	Function to calc all student features for node-rules.
 */
exports.calcFeatures = function(student){
	var courses = [], lessons = [], loms = [], 
	status = [], durations = [], correct_loms = 0, averageDuration = 500;

	var activities = student.activity_log;

	/*
		Si el estudiante ya ha realizado algún curso y tiene resultados académicos, 
		se calculan los indicadores para obtener su grupo a traves de las reglas de decisión.

		Si el estudiante no ha realizado ningún curso previo y no tiene resultados académicos, 
		se le asigna el grupo inicial o principiante.
	*/
	if(activities.length > 0){
		_.forEach(activities, function(activity){
			if(courses.indexOf(activity.idCourse) === -1){
				courses.push(activity.idCourse);
			}
			if(lessons.indexOf(activity.idLesson) === -1){
				lessons.push(activity.idLesson);
			}
			if(loms.indexOf(activity.idLom) === -1){
				loms.push(activity.idLom);
			}
			status.push(activity.status);
			durations.push(activity.duration);
		});
		correct_loms = _.countBy(status, Math.floor);
		correct_loms = (correct_loms['1'] * 100) / loms.length;

		averageDuration = _.meanBy(durations);
	}

	var features = {
						units: 			courses.length, 
						problems: 		lessons.length, 
						steps: 			loms.length, 
						corrects_steps: correct_loms, 
						duration: 		averageDuration, 
						hints: 			5, 
						skills: 		student.knowledgeLevel.length
					};

	return features;
}




/**
 *	Función para realizar la actualización de un estudiante sin eliminar datos.
 */
exports.doUpdate = function(object, newObject){
	var result, result2;
	result = _.keysIn(newObject);
	if(result.length > 0){
		_.forEach(result, function(key){
			if(typeof newObject[key] !== 'string'){
				result2 = _.keysIn(newObject[key]);
				if(result2.length > 0){
					_.forEach(result2, function(key2){
						object[key][key2] = newObject[key][key2];
					});
				} else {
					object[key] = newObject[key];
				}
			} else {
				object[key] = newObject[key];
			}
		});
	} 
	return object;
}
/**
 * 	Función para seleccionar el tipo de LOM disponible más acorde con 
 * 	el tipo de estudiante que lo solicita.
 *
 *  Orden de preferencias de los tipos de LOM:
 *	Video -> Audio -> Ejercicio -> PDF -> otro
 *	Audio -> Video -> Ejercicio -> PDF -> otro
 *	PDF -> Ejercicio -> Video -> Audio -> otro
 *	Ejercicio -> PDF -> Video -> Audio -> otro
 */
exports.selectType = function(loms, type){
	var ret = '', cont = 0, fail = [];
	while(ret === ''){
		if (loms[cont].type === type){
			ret = loms[cont].lom_id;
		} else if( cont+1 < loms.length){
			cont += 1;

		} else {
			switch(type){
				case 'video':
					if (fail.length === 1){
						type = 'practice';
					} else {
						type = 'audio';
					}
					fail.push('video');
					break;

				case 'audio':
					if (fail.length === 0){
						type = 'video';
					} else if (fail.length === 1){
						type = 'practice';
					} else {
						type = 'other';
					}
					fail.push('audio');
					break;

				case 'practice':
					if (fail.length === 1){
						type = 'video';
					} else {
						type = 'document';
					}
					fail.push('practice');
					break;

				case 'document':
					if (fail.length === 0){
						type = 'practice';
					} else if (fail.length === 1){
						type = 'video';
					} else {
						type = 'other';
					}
					fail.push('document');
					break;

				default:
					ret = loms[0].lom_id;
					break;
			}
			cont = 0;

		}
	}
	return ret;
}

/**
 *	Función para asignar al estudiante el LOM más adecuado con respecto a su tipo. 
 */
exports.selectLOM = function(student, element, course){
	var section, lesson, loms,  LOM = -1;

	section = course.sections[ functions2.exist_section_lesson(element.idSection, course.sections) ];
	lesson = section.lessons[ functions2.exist_section_lesson(element.idLesson, section.lessons) ];
	loms = lesson.loms;

	if(loms.length === 1){
		LOM = loms[0].lom_id;
	} else if (loms.length > 1){
		LOM = this.selectType(loms, student.learningStyle.type);
	}

	return LOM;
}

/**
 *  This function receives by parameter an array of lessons, a lesson type 
 *  and a course, and returns a list with the lessons included in the received 
 *  array and which are of the indicated type.
 * 
 *  The type of lesson can be 'Essential', 'Reinforcement' and 'Extension', depending on their content.
 */

exports.findTypeLesson = function(lessons, type, course){
	var ret = [];
	for(var i = 0; i <= lessons.length; i++){
				
		if(course.sections[0].lessons[lessons[i]] && course.sections[0].lessons[lessons[i]].type === type){
			ret.push(course.sections[0].lessons[lessons[i]]);
		}
	}
	return ret;
}

/** 
 *	Función que analiza si un estudiante ya ha cursado correctamente una lección con anterioridad.
 */
exports.isCursed = function(lesson, student){
	var ret = false, bool = false;
	var indexActivities = 0;
	var activities = student.activity_log;

	while(bool === false && indexActivities < activities.length){
		var activity = activities[indexActivities];

		if(lesson.name === activity.idLesson && activity.status === 1){
			bool = true;
		} else {
			indexActivities += 1;
		}
	}

	if(bool){
		ret = true;
	} 

	return ret;
}
/**
 *	Función que selecciona de un grupo de lecciones la primera lección que no ha sido
 *	cursada correctamente por el estudiante.
 */
exports.selectLessonNotCoursed = function(lessons, student){
	var ret, indexLessons = 0;

	do {
		var lesson = lessons[indexLessons];

		if(this.isCursed(lesson, student)){
			indexLessons += 1;
		} else {
			ret = lesson;
		}

	}while(!ret && indexLessons < lessons.length);

	if(!ret){
		ret = lessons[0];
	}

	return ret;
}

/**
 *	Función que devuelve la siguiente actividad de un curso a un estudiante 'Advanced'.
 */
exports.selectActivityAdvanced = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){

		/**
		 *	Básica:
		 *	Si ok: Devolver la siguiente actividad por refuerzo más dificil, si no hay, devolver
		 *	la siguiente ampliación sin cursar, y si no hay, devolver la siguiente básica.
		 *
		 *	Si nok: Devolver la siguiente actividad por refuerzo menos difícil, si no hay, devolver
		 *	la siguiente ampliación sin cursar, y si no hay, devolver la siguiente básica.
		 */
		case 'Essential':
			posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

			if(posibilities.length > 0){

				posibilities.sort(function(a, b){
					return (b.dificulty - a.dificulty);
				});

				if(status === 1){
					ret = this.selectLessonNotCoursed(posibilities, student);
				
				} else {
					if(posibilities.length > 1){
						ret = this.selectLessonNotCoursed(posibilities, student);
				
					} else {
						ret = this.selectLessonNotCoursed(posibilities, student); 
				
					}
				}
			} else {
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
					
						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
					
					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			}
			break;
		/**
		 *	Refuerzo:
		 *	Si ok: Devolver la siguiente extensión, si no hay, devolver la siguiente Básica.
		 * 
		 *	Si nok: Devolver la siguiente por refuerzo más difícil no cursada, si no hay, 
		 *	devolver la siguiente básica. 
		 */
		case 'Reinforcement':
			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 
				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			} else {
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length > 0){
					posibilities.sort(function(a, b){
						return (b.dificulty - a.dificulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}
				} else {
					 posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					 if(posibilities.length > 0){
					 	ret = this.selectLessonNotCoursed(posibilities, student); 
					 } 
				}
			}
			break;
		/**
		 *	Ampliación:
		 *	Si ok: Devolver la siguiente ampliación no cursada, si no hay, devolver la siguiente básica
		 *
		 *	Si nok: Repetir la misma ampliación.
		 */
		case 'Extension': 
			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					}
				}
			} else {
				ret = myLesson;
			}
			break;
	}

	return ret;


}

/**
 *	Función que devuelve la siguiente actividad de un curso a un estudiante 'Medium'.
 */
exports.selectActivityMedium = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		/**
		 *	Básica:
		 *	Si ok: Devuelve la siguiente por refuerzo de dificultad aleatoria, si no hay, 
		 *	devuelve la siguiente Básica.
		 *
		 *	Si nok: Repite la misma básica.
		 */
		case 'Essential':

			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 
				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
					
					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			} else {
				ret = myLesson;
			}
			break;
		/**
		 *	Refuerzo:
		 *	Si ok: Devuelve la siguiente refuerzo (si no lleva 2 por refuerzo seguidas), si no hay, 
		 *	devuelve la siguiente básica
		 *
		 *	Si nok: Repite la misma refuerzo.
		 */
		case 'Reinforcement':

			if(status === 1){
				var prevLesson = student.activity_log[student.activity_log.length - 2];
				prevLesson = functions2.exist_section_lesson(prevLesson.idLesson ,course.sections[0].lessons);
				var typePrevLesson = course.sections[0].lessons[prevLesson].type;
				var indexMyLesson = functions2.exist_section_lesson(myLesson.name ,course.sections[0].lessons);

				if(typePrevLesson !== 'Reinforcement' || indexMyLesson === prevLesson){
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} else {
						posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} 
					}
				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					
					} else {
							posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

							if(posibilities.length > 0){
								ret = this.selectLessonNotCoursed(posibilities, student); 

								if(this.isCursed(ret, student)){
									ret = -1;
								}
							}
						}
				}
			} else {
				ret = myLesson;
			}
			break;
	}

	return ret;

}

/**
 *	Función que devuelve la siguiente actividad de un curso a un estudiante 'Beginner'.
 */
exports.selectActivityBeginner = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		/**
		 *	Básica:
		 *	Si ok: devuelve la siguiente refuerzo no cursada más fácil, si no hay, 
		 *	devuelve la siguiente básica.
		 *
		 *	Si nok: Repite la misma básica.
		 */
		case 'Essential':

			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){
					ret = posibilities[0];

				} else if(posibilities.length > 1){
					posibilities.sort(function(a, b){
						return (a.dificulty - b.dificulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 
				
				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					}
				}
			} else {
				ret = myLesson;
			}
			break;
		/**
		 *	Refuerzo:
		 *	Si ok: devuelve la siguiente refuerzo no cursada más fácil, si no hay, devuelve la siguiente
		 *	básica.
		 *
		 *	Si nok: devuelve la última actividad básica realizada por el estudiante.
		 */
		case 'Reinforcement':

			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){
					ret = posibilities[0];

				} else if(posibilities.length > 1){
					posibilities.sort(function(a, b){
						return (a.dificulty - b.dificulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					}
				}
			} else {
				var history = [];

				for(var i = 0; i < course.history.length; i++){
					if(student._id.equals(course.history[i].id)){
						history.push(course.history[i].lesson);
					}
				}

				var prevLesson = this.findTypeLesson(history, 'Essential', course);
				ret = prevLesson[prevLesson.length-1];
			}

			break;
	}
	return ret;

}

/**
 *	Función para seleccionar la siguiente actividad del estudiante.
 */
exports.selectActivity = function(myLesson, course, status, student){
	var ret;
	switch(student.identification.type){
		case 'advanced':
			ret = this.selectActivityAdvanced(course, myLesson, status, student);
			break;

		case 'medium':
			ret = this.selectActivityMedium(course, myLesson, status, student);
			break;

		case 'beginner':
			ret = this.selectActivityBeginner(course, myLesson, status, student);
			break;
	}
	if (ret !== -1) { ret = functions2.exist_section_lesson(ret.name, course.sections[0].lessons); }
	return ret;
}

/**
 *  In this function the previous checks are carried out to look for the following activity:
 */
exports.nextActivity = function (element, course, student){
	var ret = 0, indexMyLesson = 0, myLesson;
		
	// It is verified that the course has at least 1 section.	
	if(course.sections.length > 0 ){
		element.idSection = course.sections[0].name;
	
	 	/**
		 *  It is checked if it is the first time an activity is requested, 
		 *  if it is, the first activity in the list of lessons is returned.
		 */
	
		if(element.status !== 0){ 
			indexMyLesson = functions2.exist_section_lesson(element.idLesson, course.sections[0].lessons);
			myLesson = course.sections[0].lessons[indexMyLesson];
			
			/**
			 *  It is checked if the learning_path of the activity is empty or not,
			 *  in a positive case the course is recognized as sequential and returns 
			 *  the next activity of the course in sequential order.
			 */
			
			if(myLesson.learning_path.length > 0){
				
				/**
				 *  If the course is not sequential and the value of the learning_path is
				 *  the same as the index of the current activity is given as finished 
				 *  the course because we are in the last activity.
				 */
				
				if(myLesson.learning_path[0] === indexMyLesson){
					ret = -1;
				} else {
					indexMyLesson = this.selectActivity(myLesson, course, element.status, student);
					if(indexMyLesson === -1) { ret = -1;}
				}
			} else {
				
				/**
				 *  If the course is sequential only the following activity is returned if 
				 *  the previous one was done correctly and the state is 'ok', if not, 
				 *  the same activity will be returned.
				 */
				
				if (course.sections[0].lessons.length > indexMyLesson + 1){
					if(element.status === 1) {
						indexMyLesson = indexMyLesson + 1;
					}
				} else { ret = -1; }
			}
		/**
		 *  If it is the first time that the student requests an activity, the system checks if he has 
		 *  already studied a lesson with the same objective as the first lessons of the current 
		 *  course, and the first lesson with the objective different from those obtained by the
		 *  student is returned.
		 */

		} else { 
			indexMyLesson = 0;
			var bool = true, n = 0, i = 0, 
			stdObjectives = student.knowledgeLevel, 
			lessons = course.sections[0].lessons;
			if(stdObjectives.length !== 0){
				do{
					if(lessons[i].objectives[0].code === stdObjectives[n].code &&
					   lessons[i].objectives[0].level === stdObjectives[n].level){
						indexMyLesson = i+1;
						if(stdObjectives.length > (n + 1)) {
							n++;
						} else if (lessons.length > (i + 1)){
							i++;
						} else {
							bool = false;
						}
					} else {
						bool = false;
					}
				}while(bool === true);
			}
		}
		
		/**
		 *  Finally returns the next activity that corresponds or a negative number depending on
		 *  the error. In addition to returning the activity this is 
		 *  included in the history of the course, so that they are reflected in order 
		 *  the activities that the student has been doing.
		 */
		if(ret !== -1){
			if(course.sections[0].lessons.length > indexMyLesson){
				element.idLesson = course.sections[0].lessons[indexMyLesson].name;
				course.history.push({id: student._id, lesson: indexMyLesson});
				ret = element;
					
			} else { ret = -2; }
		}
	} else { ret = -3; }

	return ret;
}

/**
 *	Función que asigna al estudiante un tipo en el nuevo curso matriculado, según sus
 *	resultados académicos (capacidad) y sus conocimientos previos (salto).
 */
exports.assignTypeStudent = function(student, course){
	var group;
	var jump = 0;
	var bool = true, n = 0, i = 0, ret;
	var stdObjectives = student.knowledgeLevel;

	if(course.sections.length > 0){
		var lessons = course.sections[0].lessons;

		if(student.learningStyle.group){
			/**
			 *	Si el estudiante tiene un grupo asignado, se calculan los conocimientos 
			 *	previos (salto) y se le asigna un tipo de estudiante para el nuevo curso.
			 */
			group = student.learningStyle.group;

			if(stdObjectives.length !== 0){
				do{
					if(lessons[i].objectives[0].code === stdObjectives[n].code &&
					   lessons[i].objectives[0].level <= stdObjectives[n].level){
						jump = i+1;
						if(stdObjectives.length > (n + 1)) {
							n++;
						} else if (lessons.length > (i + 1)){
							i++;
						} else {
							bool = false;
						}
					} else {
						bool = false;
					}
				}while(bool === true);

				if (jump > 2){ jump = 2; }
			}

			ret = studentType[ group ][ jump ];

		} else {
			/**
			 *	Si el estudiante no tiene un grupo asignado, se solicitará asignarlo.
			 */
			ret = -1;
		}

	} else {
		ret = -2;
	}
	return ret;
}

/**
 *	Funcion para recalcular el tipo del estudiante despues de cada bloque de actividades realizado.
 */
exports.adaptativeMode = function(student, course){
	var bool = false, 
		activitiesCoursed = student.activity_log;

	_.remove(activitiesCoursed, function(n) { 
		return !(course._id.equals(n.idCourse));
	});

	var activityIndex = activitiesCoursed.length-1,
		fail, time;

	var activities = {easy: [], medium: [], hard: []};

	/**
	 *	Se dividen las actividades cursadas según su dificultad
	 */
	if(activitiesCoursed.length > 0){
		while(bool !== true){
			var activity = activitiesCoursed[activityIndex];
			var lesson = functions2.exist_section_lesson(activity.idLesson, course.sections[0].lessons);
			lesson = course.sections[0].lessons[lesson];
			
			if(lesson.dificulty === 0){
				activities.easy.push(activity);
			} else if (lesson.dificulty === 1){
				activities.medium.push(activity);
			} else {
				activities.hard.push(activity);
				bool = true;
			}

			if(lesson.type === 'Essential'){
				bool = true;
			}
			activityIndex -= 1;
		}

		/**
		 *	Segun el tipo actual del estudiante se llama a una u otra funcion.
		 *	Se calcula el rendimiento y se analizan los tiempos.
		 */
		switch(student.identification.type){
			case 'beginner':
				fail = this.yieldBeginner(activities);
				time = this.timeBeginner(activities, student, fail);

				student.identification.type = beginnerTable[fail][time];
				break;

			case 'medium':
				fail = this.yieldMedium(activities);
				time = this.timeMedium(activities, student, fail);

				student.identification.type = mediumTable[fail][time];
				break;

			case 'advanced':
				fail = this.yieldAdvanced(activities);
				time = this.timeAdvanced(activities, student, fail);

				student.identification.type = advancedTable[fail][time];
				break; 
		}
	}


	return student;
}

/**
 *	Funcion para calcular la desviacion tipica.
 */
exports.deviation = function(restActs, mean){
	var deviation = 0;

	_.forEach(restActs, function(activity){
		deviation += Math.pow(activity.duration - mean, 2);
	});

	return (Math.sqrt(deviation / restActs.length));
}

/**
 *	Funcion para calcular el tipo de un estudiante beginner despues de un bloque de actividades.
 */
exports.yieldBeginner = function(activities){
	var fail = 'normal';
	var actsGood = [];

	if(activities.easy.length > 0){
		_.forEach(activities.easy, function(activity){
			if(activity.status === -1){
				fail = 'bad';
			}
		});

		if(fail === 'normal'){
			if(activities.medium.length > 0){
				_.forEach(activities.medium, function(activity){
					if(activity.status === 1){
						actsGood.push(activity);
					}
				});

				if(actsGood.length * 2.0 >= activities.medium.length){
					fail = 'good';
				}
			}
		}
	}

	return fail;
}

/**
 *	Funcion para calcular el tipo de un estudiante medium despues de un bloque de actividades.
 */
exports.yieldMedium = function(activities){
	var fail = 'normal';
	var newType2 = true;
	if(activities.easy.length > 0){
		_.forEach(activities.easy, function(activity){
			if(activity.status === -1){
				fail = 'bad';
			}
		});

		if(fail === 'normal'){
			if(activities.medium.length > 0){
				_.forEach(activities.medium, function(activity){
					if(activity.status === -1){
						newType2 = false;
					}
				});

				if(newType2){
					fail = 'good';
				}

			}
		}
	}
	return fail;
}

/**
 *	Funcion para calcular el tipo de un estudiante advanced despues de un bloque de actividades.
 */
exports.yieldAdvanced = function(activities){
	var fail = 'normal';
	var actsGood = [];

	if(activities.easy.length > 0){
		_.forEach(activities.easy, function(activity){
			if(activity.status === -1){
				fail = 'bad';
			}
		});

		if(fail === 'normal'){
			if(activities.medium.length > 0){
				_.forEach(activities.medium, function(activity){
					if(activity.status === -1){
						fail = 'bad';
					}
				});

				if(fail === 'normal'){
					if(activities.hard.length > 0){
						_.forEach(activities.hard, function(activity){
							if(activity.status === 1){
								actsGood.push(activity);
							}
						});

						if(actsGood.length * 2.0 >= activities.hard.length){
							fail = 'good';
						}
					}
				} 
			}

		} 
	}
	return fail;
}

/**
 *	Funcion para analizar los tiempos de un estudiante beginner
 * 	Tiempo: 0 = corto, 1 = medio, 2 = largo.
 */
exports.timeBeginner = function(activities, student, fail){
	var time = 2;

	if(fail === 'good'){
		/**
		 * Si no falla ni faciles ni mas del 50% de medias: se calcula la media y a desviacion tipica
		 * para analizar los tiempos de las actividades del bloque. Se calcula si el estudiante he realizado
		 * tres o mas operaciones antes del bloque.
		 */
		var res = this.calculateTime(student, activities);
		if(res.easy !== -1){

			// Si la duracion de las actividades fáciles y medias es media o corta: Tiempo corto.
			if(res.easy < 2 && res.medium < 2){
				time = 1;
				if(res.easy < 1 || res.medium < 1){
					time = 0;
				} 
			}
		} 
	} else {
		time = 1;
	}

	return time;
}

/**
 *	Funcion para analizar los tiempos de un estudiante medium
 * 	Tiempo: 0 = corto, 1 = medio, 2 = largo.
 */
exports.timeMedium = function(activities, student, fail){
	var time = 2;

	if(fail === 'normal'){
		time = 1;
	} else {
		
		var res = this.calculateTime(student, activities);
		if(res.easy !== -1){

			if(res.hard === 0 && res.medium < 2 || res.hard === 1 && res.medium === 0){
				time = 0;
			} else if( res.hard === 2 && res.medium === 2 || 
			  res.hard === 2 && res.easy === 2 || res.medium === 2 && res.easy === 2){
				time = 2;
			} else if( res.hard === 2 && res.medium === 1 || res.hard === 1 && res.medium === 2){
				time = 2;
			} else {
				time = 1;
			}

		} 
	} 

	return time;
}

/**
 *	Funcion para analizar los tiempos de un estudiante advanced
 * 	Tiempo: 0 = corto, 1 = medio, 2 = largo.
 */
exports.timeAdvanced = function(activities, student, fail){
	var time = 2;

	if(fail === 'good'){
		time = 1;
	} else {
		
		var res = this.calculateTime(student, activities);
		if(res.easy !== -1){

			if(res.hard === 2 || res.hard === 1 && (res.medium === 2 || res.easy === 2) || 
			  res.medium === 2 && res.easy === 2){
				time = 2;
			} else if (res.hard === 1 && (res.medium < 2 && res.easy < 2) || 
			  res.hard === 0 && res.medium === 2 || res.hard === 0 && res.easy === 2){
				time = 1;
			} else {
				time = 0;
			}

		} 
	} 

	return time;
}

/**
 *	Funcion que calcula la desviacion y la media de la duracion de las actividades 
 *	y analiza los resultados.
 */
exports.calculateTime = function(student, activities){
	var res = {easy: -1, medium: -1, hard: -1};
	var restActs = student.activity_log.slice();
	restActs =  _.pullAllBy(restActs, activities.easy, '_id');
	restActs =  _.pullAllBy(restActs, activities.medium, '_id');
	restActs =  _.pullAllBy(restActs, activities.hard, '_id');

	if(restActs.length > 3){
		var mean = _.meanBy(restActs, 'duration');
		var deviation  = this.deviation(restActs, mean);

		// Si la desviacion es mayor que la media, se realiza un sesgo (10%) y se recalculan.
		if(deviation >= mean){	

			// Se ordenan las actividades segun a duracion.
			restActs.sort(function(a, b){
				return (b.duration - a.duration);
			});

			// Sesgo
			var sesg = restActs.length / 10;
			restActs = _.drop(restActs, sesg);
			restActs = _.dropRight(restActs, sesg);

			// Recalcula media y desviacion
			mean = _.meanBy(restActs, 'duration');
			deviation = this.deviation(restActs, mean);
		}

		// Analiza tiempos de actividades faciles, medias y dificiles.
		
		res.easy = this.analizeTime(activities.easy, mean, deviation);
		res.medium = this.analizeTime(activities.medium, mean, deviation);
		res.hard = this.analizeTime(activities.hard, mean, deviation);
	}

	return res;
}

/**
 * 	Funcion para analizar los tiempos del alumno con respecto a su media de duracion.
 */
exports.analizeTime = function(activities, mean, deviation){
	var res = 0, time, shortTime = false, longTime = false;
	_.forEach(activities, function(act){

		/**
		 * 	Si 1 actividad ha durado mas que la media y mas que la media+desviacion: tiempo largo.
		 *	Si 1 actividad ha durado menos que la media y menos que la media-desviacion: tiempo corto.
		 *	Si hay mas actividades por encima de la media que por debajo: tiempo largo.
		 *	Si hay mas actividades por debajo de la media que por encima: tiempo corto.
		 *	Otros casos: tiempo medio.
		 */
		
		if(act.duration >= mean){
			if(act.duration > mean+deviation){
				longTime = true;
			} else {
				res += 1;
			}
		} else if(act.duration <= mean){
			if( act.duration < mean-deviation){
				shortTime = true;
			} else {
				res -= 1;
			}
		} 

	});

	if(longTime || res > 0 && res > activities.length/2){
		time = 2;
	} else if(shortTime || res < 0 && (-res) > activities.length/2){
		time = 0;
	} else {
		time = 1;
	}

	return time;
}





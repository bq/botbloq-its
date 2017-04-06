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

exports.selectLessonNotCoursed = function(lessons, student){
	var ret, indexLessons = 0, bool = false;
	var activities = student.activity_log;

	do {
		var lesson = lessons[indexLessons];
		var indexActivities = 0;

		while(bool === false && indexActivities < activities.length){
			var activity = activities[indexActivities];

			if(lesson.name === activity.idLesson && activity.status === 1){
				bool = true;
			} else {
				indexActivities += 1;
			}
		}

		if(bool){
			indexLessons += 1;
			bool = false;
		} else {
			ret = lesson;
		}

	}while(!ret && indexLessons < lessons.length);

	if(!ret){
		ret = lessons[0];
	}

	return ret;
}


exports.selectActivityAdvanced = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		case 'Essential':
			posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

			if(posibilities.length > 0){

				posibilities.sort(function(a, b){
					return (a.dificulty - b.dificulty);
				});

				if(status === 1){
					ret = this.selectLessonNotCoursed(posibilities, student);
				} else {
					if(posibilities.length > 1){
						ret = this.selectLessonNotCoursed(posibilities.shift(), student);
					} else {
						ret = this.selectLessonNotCoursed(posibilities, student); 
					}
				}
			} else {
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 

				} else {
					posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
					
					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			}
			break;
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
						return (a.dificulty - b.dificulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 
				} else {
					 posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

					 if(posibilities.length > 0){
					 	ret = this.selectLessonNotCoursed(posibilities, student); 
					 } 
				}
			}
			break;

		case 'Extension': 
			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 
				} 
			} else {
				ret = myLesson;
			}
			break;
	}

	return ret;


}

exports.selectActivityMedium = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
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

		case 'Reinforcement':

			if(status === 1){

				var prevLesson = student.activity_log[student.activity_log.length - 2];
				prevLesson = functions2.exist_section_lesson(prevLesson.idLesson ,course.sections[0].lessons);
				var typePrevLesson = course.sections[0].lessons[prevLesson].type;

				if(typePrevLesson !== 'Reinforcement'){
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

exports.selectActivityBeginner = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		case 'Essential':

			if(status === 1){
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){
					ret = posibilities[0];

				} else if(posibilities.length > 1){

					posibilities.sort(function(a, b){
						return (b.dificulty - a.dificulty);
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

		case 'Reinforcement':

			if(status === 1){

				posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){

					ret = posibilities[0];

				} else if(posibilities.length > 1){

					posibilities.sort(function(a, b){
						return (b.dificulty - a.dificulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 
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

exports.assignTypeStudent = function(student, course){
	var group;
	var jump = 0;
	var bool = true, n = 0, i = 0, ret;
	var stdObjectives = student.knowledgeLevel;

	if(course.sections.length > 0){
		var lessons = course.sections[0].lessons;

		if(student.learningStyle.group){
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
			ret = -1;
		}

	} else {
		ret = -2;
	}
	return ret;
}















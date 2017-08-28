'use strict';
/* jshint node: true */

var functions2 = require('../courses/courses.functions.js');
var _ = require('lodash');
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
};

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

};

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

};

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
};

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
};

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
};

/**
 *	Function to calc all student features for node-rules.
 */
exports.calcFeatures = function(student){
	var courses = [], lessons = [], loms = [], 
	status = [], durations = [], correct_loms = 0, averageDuration = 500;

	var activities = student.activity_log;

	/**
	 *	If the student has already taken a course and has academic results, 
	 *	the indicators are calculated to obtain his / her group through the decision rules.
	 *
	 *	If the student has not taken any previous course and does not have academic results,
	 *	he is assigned the initial group or beginner.
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
};




/**
 *	Function to update a student without deleting data.
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
};
/**
 * 	Function to select the type of LOM available more in agreement 
 *	with the type of student that requests it.
 *
 *  LOM types preferences :
 *	Video -> Audio -> Exercise -> PDF -> other
 *	Audio -> Video -> Exercise -> PDF -> other
 *	PDF -> Exercise -> Video -> Audio -> other
 *	Exercise -> PDF -> Video -> Audio -> other
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
};

/**
 *	Function to assign the student the most appropriate LOM with respect to its type.
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
};

/**
 *  This function receives by parameter an array of lessons, a lesson type 
 *  and a course, and returns a list with the lessons included in the received 
 *  array and which are of the indicated type.
 * 
 *  The type of lesson can be 'Essential', 'Reinforcement' and 'Extension', depending on their content.
 */

exports.findTypeLessonPath = function(lessons, type, course){
	var ret = [];
	for(var i = 0; i <= lessons.length; i++){
				
		if(course.sections[0].lessons[lessons[i]-1] && course.sections[0].lessons[lessons[i]-1].type === type){
			ret.push(course.sections[0].lessons[lessons[i]-1]);
		}
	}
	return ret;
};

exports.findTypeLesson = function(lessons, type, course){
	var ret = [];
	for(var i = 0; i <= lessons.length; i++){
				
		if(course.sections[0].lessons[lessons[i]] && course.sections[0].lessons[lessons[i]].type === type){
			ret.push(course.sections[0].lessons[lessons[i]]);
		}
	}
	return ret;
};

/** 
 *	Function which analyzes if a student has already successfully completed a lesson before.
 */
exports.isCursed = function(lesson, student){
	var bool = false;
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

	return bool;
};
/**
 *	Function that selects from a group of lessons the first lesson 
 *	that has not been correctly completed by the student.
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
};

/**
 *	Function that returns the next activity of a course to an 'Advanced' student.
 */
exports.selectActivityAdvanced = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){

		/**
		 *	Essential:
		 *	If ok: Return the following activity 'Reinforcement' more difficult, if there is not, 
		 *	return the next 'Extension' without completing, and if there is, return the following 'Essential'.
		 *
		 *	If nok: Return the following activity 'Reinforcement' less difficult, if there is, return the next 
		 *	'Extension' without completing, and if there is, return the following 'Essential'.
		 */
		case 'Essential':
			posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

			if(posibilities.length > 0){

				posibilities.sort(function(a, b){
					return (b.difficulty - a.difficulty);
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
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);
					
						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);
					
					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			}
			break;
		/**
		 *	Reinforcement:
		 *	If ok: Return the next 'Extension', if there is, return the following 'Essential'.
		 * 
		 *	If nok: Return the next most difficult 'Reinforcement' not completed, if there is, 
		 *	return the following 'Essential'. 
		 */
		case 'Reinforcement':
			if(status === 1){
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 
				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			} else {
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length > 0){
					posibilities.sort(function(a, b){
						return (b.difficulty - a.difficulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}
				} else {
					 posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

					 if(posibilities.length > 0){
					 	ret = this.selectLessonNotCoursed(posibilities, student); 
					 } 
				}
			}
			break;
		/**
		 *	Extension:
		 *	If ok: Return the next 'Extension' not completed, if there is none, return the following 'Essential'.
		 *
		 *	If nok: Repeat same 'Extension'.
		 */
		case 'Extension': 
			if(status === 1){
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Extension', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

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


};

/**
 *	Function that returns the next activity of a course to a student 'Medium'.
 */
exports.selectActivityMedium = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		/**
		 *	Essential:
		 *	If ok: Returns the following 'Reinforcement' by random difficulty , if there is not, 
		 *	return the following 'Essential'.
		 *
		 *	If nok: Repeat same 'Essential'.
		 */
		case 'Essential':

			if(status === 1){
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length > 0){
					ret = this.selectLessonNotCoursed(posibilities, student); 
				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);
					
					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} 
				}
			} else {
				ret = myLesson;
			}
			break;
		/**
		 *	Reinforcement:
		 *	If ok: It returns the following 'Reinforcement' (if it is not the third followed), if there is not, 
		 *	it returns the following 'Essential'.
		 *
		 *	If nok: Repeat same 'Reinforcement'.
		 */
		case 'Reinforcement':

			if(status === 1){
				var prevLesson = student.activity_log[student.activity_log.length - 2];
				prevLesson = functions2.exist_section_lesson(prevLesson.idLesson ,course.sections[0].lessons);
				var typePrevLesson = course.sections[0].lessons[prevLesson].type;
				var indexMyLesson = functions2.exist_section_lesson(myLesson.name ,course.sections[0].lessons);

				if(typePrevLesson !== 'Reinforcement' || indexMyLesson === prevLesson){
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					} else {
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} 
					}
				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					
					} else {
							posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

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

};

/**
 *	Function that returns the next activity of a course to a student 'Beginner'.
 */
exports.selectActivityBeginner = function(course, myLesson, status, student){
	var ret = -1, posibilities;

	switch(myLesson.type){
		/**
		 *	Essential:
		 *	If ok: Returns the next uncompleted 'Reinforcement' easier, if there is not, 
		 *	returns the following 'Essential'.
		 *
		 *	If nok: Repeat same 'Essential'.
		 */
		case 'Essential':

			if(status === 1){
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){
					ret = posibilities[0];

				} else if(posibilities.length > 1){
					posibilities.sort(function(a, b){
						return (a.difficulty - b.difficulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 
				
				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

					if(posibilities.length > 0){
						ret = this.selectLessonNotCoursed(posibilities, student); 
					}
				}
			} else {
				ret = myLesson;
			}
			break;
		/**
		 *	Reinforcement:
		 *	If ok: Returns the next uncompleted reinforcement easier, if there is not, 
		 *	returns the following 'Essential'.
		 *
		 *	If nok: Returns the last 'Essential' activity completed by the student.
		 */
		case 'Reinforcement':

			if(status === 1){
				posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Reinforcement', course);

				if(posibilities.length === 1){
					ret = posibilities[0];

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else if(posibilities.length > 1){
					posibilities.sort(function(a, b){
						return (a.difficulty - b.difficulty);
					});

					ret = this.selectLessonNotCoursed(posibilities, student); 

					if(this.isCursed(ret, student)){
						posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

						if(posibilities.length > 0){
							ret = this.selectLessonNotCoursed(posibilities, student); 
						} else {
							ret = -1;
						}
					}

				} else {
					posibilities = this.findTypeLessonPath(myLesson.learning_path, 'Essential', course);

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

};

/**
 *	Function to select the next student activity.
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
};

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
				
				if((myLesson.learning_path[0] - 1) === indexMyLesson){
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
};

/**
 *	Function that assigns the student a type in the new course enrolled, according 
 *	to their academic results (yield) and their previous knowledge (jump).
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
			 *	If the student has an assigned group, the previous knowledge (jump) 
			 *	is calculated and assigned a student type for the new course.
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
			 *	If the student does not have an assigned group, they will be asked to assign it.
			 */
			ret = -1;
		}

	} else {
		ret = -2;
	}
	return ret;
};

/**
 *	Function to recalculate the type of student after each completed block of activities.
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
	 *	The activities are divided according to their difficulty
	 */
	if(activitiesCoursed.length > 0){
		while(bool !== true){
			var activity = activitiesCoursed[activityIndex];
			var lesson = functions2.exist_section_lesson(activity.idLesson, course.sections[0].lessons);
			lesson = course.sections[0].lessons[lesson];
			
			if(lesson.difficulty === 0){
				activities.easy.push(activity);
			} else if (lesson.difficulty === 1){
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
		 *	According to the current type of student is called to one or another function. 
		 *	The performance is calculated and the times are analyzed.
		 */
		switch(student.identification.type){
			case 'beginner':
				fail = this.yieldBeginner(activities);
				time = this.timeBeginner(activities, student, fail);

				console.log(fail + ' ---- ' + time);

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
};

/**
 *	Function to calculate the standard deviation.
 */
exports.deviation = function(restActs, mean){
	var deviation = 0;

	_.forEach(restActs, function(activity){
		deviation += Math.pow(activity.duration - mean, 2);
	});

	return (Math.sqrt(deviation / restActs.length));
};

/**
 *	Function to calculate the type of a student beginner after a block of activities.
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
};

/**
 *	Function to calculate the type of a student medium after a block of activities.
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
};

/**
 *	Function to calculate the type of a student advanced after a block of activities.
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
};

/**
 *	Function to analyze the times of a student beginner
 *  - Time: 0 = short, 1 = medium, 2 = long.
 */
exports.timeBeginner = function(activities, student, fail){
	var time = 2;

	if(fail === 'good'){
		/**
		 * 	If it does not fail 'easy' nor more than 50% of 'medium': the average and standard 
		 *	deviation is calculated to analyze the times of the activities of the block. It is calculated 
		 *	if the student has performed three or more operations before the block.
		 */
		var res = this.calculateTime(student, activities);
		if(res.easy !== -1){

			// If the duration of the easy and medium activities is medium or short: Short time.
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
};

/**
 *	Function to analyze the times of a student medium
 *  - Time: 0 = short, 1 = medium, 2 = long.
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
};

/**
 *	Function to analyze the times of a student advanced
 *  - Time: 0 = short, 1 = medium, 2 = long.
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
};

/**
 *	Function that calculates the deviation and the average of the duration of 
 *	the activities and analyzes the results.
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

		// If the deviation is greater than average, a bias (10%) is performed and recalculated.
		if(deviation >= mean){	

			// Activities are sorted according to duration.
			restActs.sort(function(a, b){
				return (b.duration - a.duration);
			});

			// Bias
			var sesg = restActs.length / 10;
			restActs = _.drop(restActs, sesg);
			restActs = _.dropRight(restActs, sesg);

			// Recalculates mean and deviation
			mean = _.meanBy(restActs, 'duration');
			deviation = this.deviation(restActs, mean);
		}

		// It analyzes easy, medium and difficult times of activities.
		res.easy = this.analizeTime(activities.easy, mean, deviation);
		res.medium = this.analizeTime(activities.medium, mean, deviation);
		res.hard = this.analizeTime(activities.hard, mean, deviation);
	}

	return res;
};

/**
 * 	Function to analyze the times of the student with respect to their average of duration.
 */
exports.analizeTime = function(activities, mean, deviation){
	var res = 0, time, shortTime = false, longTime = false;
	_.forEach(activities, function(act){

		/**
		 * 	If 1 activity has lasted more than the average and more than the average + deviation: long time.
		 *	If 1 activity has lasted less than the average and less than the mean-deviation: short time.
		 *	If there are more activities above the average than below: long time.
		 *	If there are more activities below the average than above: short time.
		 *	Other cases: average time.
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
};





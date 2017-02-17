'use strict';
var functions2 = require('../courses/courses.functions.js');
var Courses = require('../courses/courses.model.js');
var _ = require('lodash');


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
 *  This is an auxiliary function of the following function and returns 
 *  the index of the next course activity. To calculate it uses the last 
 *  activity performed, its type and its status.
 */

exports.selectActivity = function(myLesson, course, status){
	var ret, posibilities, random;
	switch(myLesson.type){
		
	/**
	 *  If the activity is of type 'Essential':
	 *   - with 'ok' status: first returns the activity of type 'Reinforcement', 
	 *     and if there is no, returns the following 'Essential'.
	 *
	 *   - with status 'nok': first returns the activity of type 'Reinforcement', 
	 * 	   and if there is no, returns the same 'Essential' activity.
	 */
		
	case 'Essential':
		posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);
		if (posibilities.length > 0){
			random = Math.floor(Math.random() * posibilities.length);
			ret = posibilities[random];
		} else {
			if(status === -1){ ret = myLesson; }
			else {
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
				if (posibilities.length > 0){
					random = Math.floor(Math.random() * posibilities.length);
					ret = posibilities[random];
				} else {ret = -1; }
			}
		}
		break;
		
	/**
	 *  If the activity is of type 'Reinforcement':
	 *   - with 'ok' status: first returns the activity of type 'Extension', 
	 *     and if there is no, returns the following 'Essential'.
	 *
     *   - with status 'nok': first returns the activity of type 'Reinforcement', 
	 * 	   and if there is no, returns the activity of type 'Essential' above.
	 */
		
	case 'Reinforcement':
		if(status === 1){
			posibilities = this.findTypeLesson(myLesson.learning_path, 'Extension', course);
			if (posibilities.length > 0){
				random = Math.floor(Math.random() * posibilities.length);
				ret = posibilities[random];
			} else {
				posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
				if (posibilities.length > 0){
					random = Math.floor(Math.random() * posibilities.length);
					ret = posibilities[random];
				} else { ret = -1; }
			}
		} else {
			posibilities = this.findTypeLesson(myLesson.learning_path, 'Reinforcement', course);
			if (posibilities.length > 0){
				random = Math.floor(Math.random() * posibilities.length);
				ret = posibilities[random];
			} else {
				posibilities = this.findTypeLesson(course.history, 'Essential', course);
				if (posibilities.length > 0) {
					ret = posibilities[posibilities.length-1];
				} else { ret = -1; }
			}
		}
		break;
		
   	/**
   	 *  If the activity is of type 'Extension':
   	 *  Both ok and nok returns the following 'Essential' activity. 
   	 */
		
	case 'Extension':
		posibilities = this.findTypeLesson(myLesson.learning_path, 'Essential', course);
		if (posibilities.length > 0){
			random = Math.floor(Math.random() * posibilities.length);
			ret = posibilities[random];
		} else { ret = -1; }
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
					indexMyLesson = this.selectActivity(myLesson, course, element.status);
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
				if (course.sections[0].lessons[indexMyLesson].loms.length > 0){
					element.idLom = course.sections[0].lessons[indexMyLesson].loms[0].lom_id;
					course.history.push(indexMyLesson);
					ret = element;
			
				}else { ret = -2; }
		
			} else { ret = -3; }
		}
	} else { ret = -4; }
	
	return ret;
}

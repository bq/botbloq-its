'use strict';
var functions2 = require('../courses/courses.functions.js');


/**
 *  Controls callback errors and shows the solution
 */
exports.controlErrors = function (err, res, ret){
    if (err) {
        console.log(err);
        res.status(404).send(err);
    } 
	else res.json(ret);
}

/**
 *	Check if the student exists and if it is activated	
 */
exports.studentFound = function (student, req, res){
	var bool = false, ret;
	
	if (req.params.idstd != null) ret = req.params.idstd;
	else ret = req.params.id;
	
	if(!student)
		res.end("The student with id: " + ret + " is not registrated");
	else {
		if(student.active == 0)
			res.end("The student with id: " + ret + " is not activated");
		else bool = true;
	}
	return bool;
}

exports.nextActivity = function (element, course){
	var ret = 0, indexMyLesson = 0, myLesson;
		
	if(course.sections.length > 0 ){
		element.idSection = course.sections[0].name;
	
		if(element.status > 0 || element.status < 0){ 
			indexMyLesson = functions2.find_lesson(element.idLesson, course.sections[0].lessons);
			myLesson = course.sections[0].lessons[indexMyLesson];
			if(myLesson.learning_path.ok.length > 0){
				if(myLesson.learning_path.ok[0] == indexMyLesson){
					ret = -1;
				} else {
					if(element.status == 1) indexMyLesson = myLesson.learning_path.ok[0];
					else indexMyLesson = myLesson.learning_path.nok[0];
				}
			} else {
				if (course.sections[0].lessons.length > indexMyLesson + 1){
					if(element.status == 1) 
						indexMyLesson = indexMyLesson + 1;
					
				} else ret = -1;
			}
		
		} else indexMyLesson = 0;
		
		if(ret != -1){
			if(course.sections[0].lessons.length > indexMyLesson){				
				element.idLesson = course.sections[0].lessons[indexMyLesson].name;
				if (course.sections[0].lessons[indexMyLesson].loms.length > 0){
					element.idLom = course.sections[0].lessons[indexMyLesson].loms[0].lom_id;
					ret = element;
			
				}else ret = -2;
		
			} else ret = -3;
		}
	} else ret = -4; 

	return ret;
}
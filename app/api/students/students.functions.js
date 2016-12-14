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


exports.findTypeLesson = function(lessons, type, course){
	var ret = [], option;
	for(var i = 0; i <= lessons.length; i++){
				
		if(course.sections[0].lessons[lessons[i]] != undefined && course.sections[0].lessons[lessons[i]].type == type){
			ret.push(course.sections[0].lessons[lessons[i]]);
		}
	}
	return ret;
}

exports.selectActivity = function(myLesson, course, status){
	var ret, posibilities, random;
	switch(myLesson.type){
	case "Essential":
		posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Reinforcement", course);
		if (posibilities.length > 0){
			random = Math.floor(Math.random() * posibilities.length);
			ret = posibilities[random];
		} else {
			if(status == -1) ret = myLesson;
			else {
				posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Essential", course);
				if (posibilities.length > 0){
					random = Math.floor(Math.random() * posibilities.length);
					ret = posibilities[random];
				} else ret = -1;	
			}
		}
		break;
	case "Reinforcement":
		if(status == 1){
			posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Extension", course);
			if (posibilities.length > 0){
				random = Math.floor(Math.random() * posibilities.length);
				ret = posibilities[random];
			} else {
				posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Essential", course);
				if (posibilities.length > 0){
					random = Math.floor(Math.random() * posibilities.length);
					ret = posibilities[random];
				} else ret = -1;
			}
		} else {
			posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Reinforcement", course);
			if (posibilities.length > 0){
				random = Math.floor(Math.random() * posibilities.length);
				ret = posibilities[random];
			} else {
				posibilities = this.findTypeLesson(course.history, "Essential", course);
				if (posibilities.length > 0)
					ret = posibilities[posibilities.length-1];
				else ret = -1;
			}
		}
		break;
	case "Extension":
		posibilities = this.findTypeLesson(myLesson.learning_path.ok, "Essential", course);
		if (posibilities.length > 0){
			random = Math.floor(Math.random() * posibilities.length);
			ret = posibilities[random];
		} else ret = -1;
		break;
	}
	
	if (ret != -1) ret = functions2.find_lesson(ret.name, course.sections[0].lessons);
	return ret;
}

exports.nextActivity = function (element, course){
	var ret = 0, indexMyLesson = 0, myLesson;
		
	if(course.sections.length > 0 ){
		element.idSection = course.sections[0].name;
	
		if(element.status != 0){ 
			indexMyLesson = functions2.find_lesson(element.idLesson, course.sections[0].lessons);
			myLesson = course.sections[0].lessons[indexMyLesson];
			if(myLesson.learning_path.ok.length > 0){
				
				if(myLesson.learning_path.ok[0] == indexMyLesson){
					ret = -1;
				} else {
					indexMyLesson = this.selectActivity(myLesson, course, element.status);
					if(indexMyLesson == -1) ret = -1;
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
					course.history.push(indexMyLesson);
					ret = element;
			
				}else ret = -2;
		
			} else ret = -3;
		}
	} else ret = -4; 
	
	return ret;
}




















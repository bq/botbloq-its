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


exports.findActivities = function (element, course, i, j, k){
	var arraySections, arrayLessons, arrayLoms, bool, ret;
	arraySections = course.sections;
	do {
		if(arraySections.length > i){
			arrayLessons = arraySections[i].lessons;
			if(arrayLessons.length > j){
				arrayLoms = arrayLessons[j].loms;
				if(arrayLoms.length > k){
					element.idSection = arraySections[i].name;
					element.idLesson = arrayLessons[j].name;
					element.idLom = arrayLoms[k].lom_id;
					element.status = -1;
					ret = element;
					bool = true;
				} else{
					++j;
					k = 0;
				} 
			} else{
				++i;
				j = 0;
				k = 0;
			}
		} else{
			ret = -1;
			bool = true;
		} 
	} while(!bool);
	
	return ret;
}

exports.nextActivity = function (element, course){
	var ret = 0, coursed = false, arraySections, arrayLessons,
	arrayLoms, i = 0, j = 0, k = 0;
	
	arraySections = course.sections;
	if (element.idSection == "") {
		
		ret = this.findActivities(element, course, i, j, k);
		
	} else {
		
		i = functions2.find_section(element.idSection, arraySections);
		if(i != -1){
			arrayLessons = arraySections[i].lessons;
			j = functions2.find_lesson(element.idLesson, arrayLessons);
			if (j != -1){
				arrayLoms = arrayLessons[j].loms;
				k = functions2.find_lom(element.idLom, arrayLoms);
				if (k != -1){
					
					ret = findActivities(element, course, i, j, k);
					
				} else ret = -2;
			} else ret =-3;
		} else ret =-4;
		
	}
			
	
	
	return ret;
}






























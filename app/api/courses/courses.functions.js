'use strict';

var Courses = require('./courses.model.js'),
    config = require('../../res/config.js'),
    _ = require('lodash');

/*
returns the index position of the section or lesson identified by id
in the list of sections or lessons. If it doesn't exists in the list returns -1
*/

exports.exist_section_lesson = function (id,array){	
	var ret = -1;
	
	_.forEach(array, function(value){
		if(value.name === id) {
			ret = _.indexOf(array,value);
		}
	});
	return ret;
}

/*
returns the index position of the lom identified by lomId
in the list of loms. If it doesn't exists in the list returns -1
*/

exports.find_lom = function(lomId,loms){
	var ret = -1;
	
	_.forEach(loms, function(value){
		if(value.lom_id === lomId) {
			ret = _.indexOf(loms,value);
		}
	});
	return ret;
}

/*
Find the first course with the name indicated. Then
update the indicated field with the value 
*/
exports.update_field = function(courseId,field,value){
	Courses.findOne({_id: courseId}, function (err, course) {
		course[field] = value;
		course.save(function (err) {return err});
		}
	);
}


exports.controlErrors = function (err, res, ret){
    if (err) {
        console.log(err);
        res.sendStatus(err.code);
    } 
	else { 
		if(res.statusCode === 200){
			res.json(ret); 
		} else {
			res.sendStatus(res.statusCode);
		}
	}
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

exports.translateFormat = function(format){
	var type = 'other';
	
	if(format.includes('audio')){
		type = 'audio';
	} else if(format.includes('video')){
		type = 'video';
	} else if(format.includes('text') || format.includes('image')){
		type = 'document';
	} else if(format.includes('application')){
		if(format.includes('word') || format.includes('powerpoint')){
			type = 'document';
		} else if(format.includes('youtube')){
			type = 'video';
		} else {
			type = 'exercise';
		}
	}

	return type;

}


'use strict';

/* jshint node: true */

var Courses = require('./courses.model.js'),
	fs = require('fs'),
    _ = require('lodash');


/**
 *	Returns the index position of the section or lesson identified by id
 *	in the list of sections or lessons. If it doesn't exists in the list returns -1
 */
exports.exist_section_lesson = function (id,array){	
	var ret = -1;
	
	_.forEach(array, function(value){
		if(value.name === id) {
			ret = _.indexOf(array,value);
		}
	});
	return ret;
};

/**
 *	Returns the index position of the lom identified by lomId
 *	in the list of loms. If it doesn't exists in the list returns -1
 */
exports.find_lom = function(lomId,loms){
	var ret = -1;
	
	_.forEach(loms, function(value){
		if(value.lom_id.toString() === lomId.toString()) {
			ret = _.indexOf(loms,value);
		}
	});
	return ret;
};

/**
 *	Find the first course with the name indicated. Then
 *	update the indicated field with the value 
 */
exports.update_field = function(courseId,field,value){
	Courses.findOne({_id: courseId}, function (err, course) {
		course[field] = value;
		course.save(function (err) {return err;});
		}
	);
};

/**
 *  Controls callback errors and shows the solution
 */
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
};

/**
 *	Function to update a course without deleting data.
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
 *	Function to translate the LOM format to a type.
 */
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

};

exports.base64_encode = function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

// function to create file from base64 encoded string
exports.base64_decode = function(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    return fs.writeFileSync(file, bitmap);

}


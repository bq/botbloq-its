'use strict';
/* jshint node: true */

var _ = require('lodash');

var fs = require('fs');
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
 *	Function to update a LOM without deleting data.
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

'use strict';

var _ = require('lodash');
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

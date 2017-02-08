'use strict';

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

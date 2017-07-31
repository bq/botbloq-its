// grab the things we need
/* jshint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identificationSchema = new Schema({
    name: {
        type: String,
		required: false,		
    },
    email: {
        type: String,
		required: false,
		unique : true
    },
	_id: false
});


var teacherSchema = new Schema({
	identification: {
		type:identificationSchema,
		required: false,
		default: ''
	}
});

// the schema is useless so far
// we need to create a model using it
var Teachers = mongoose.model('Teacher', teacherSchema);

// make this available to our Node applications
module.exports = Teachers;
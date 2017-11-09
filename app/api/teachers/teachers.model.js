// grab the things we need
/* jshint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identificationSchema = new Schema({
    name: {
        type: String,
		required: false,
        unique : true		
    },
    email: {
        type: String,
		required: false,
		unique : true
    },
    password: {
    	type: String,
    	required: false,
    },
	_id: false
});

var elementsSchema = new Schema({
    loms: {
        type: [String],
        required: false,
        default:[]
    },
    courses: {
        type: [String],
        required: false,
        default:[]
    },
    _id: false
});

var teacherSchema = new Schema({
	identification: {
		type:identificationSchema,
		required: false,
		default: ''
	},
    elements: {
        type:elementsSchema,
        required: false,
        default: ''
    },
    role: {
        type:String,
        required: false,
        default: 'teacher'
    }
});

// the schema is useless so far
// we need to create a model using it
var Teachers = mongoose.model('Teacher', teacherSchema);

// make this available to our Node applications
module.exports = Teachers;
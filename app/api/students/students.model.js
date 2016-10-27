// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identificationSchema = new Schema({
    name: {
        type: String,
		required: true
    },
    email: {
        type: String,
		required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    type: {
        type: String,
		required: true,
		enum: [
			"beginner",
			"medium",
			"advanced"
		]
    },
	_id: false
});

var learningStyleSchema = new Schema({
    type: {
        type: String,
		enum: [
			"strong",
			"moderate",
			"balanced"
		]
    },
    comprehension: {
        type: String,
		required: true,
		enum:[
			"sequential",
			"global"
		]
    },
    input: {
        type: String,
		required: true,
		enum:[
			"visual",
			"verbal"
		]
    },
    perception: {
        type: String,
		required: true,
		enum: [
			"sensing",
			"intuitive"
		]
    },
    processing: {
        type: String,
		required: true,
		enum: [
			"active",
			"reflexive"
		]
    },
	_id: false
});

var knowledgeLevelSchema = new Schema({
    name: {
        type: String,
    },
    level: {
        type: String,
    },
    target: {
        type: String,
    },
	_id: false
});



var studentSchema = new Schema({
	identification: {
		type:identificationSchema,
		required: false,
		default: ''
	},
	learningStyle: {
		type: learningStyleSchema,
		required: false,
		default: ''
	},
	knowledgeLevel: {
		type: knowledgeLevelSchema,
		required: false,
		default: ''
	},
    course: {
        type: String,
        required: false,
		default: ''
    }
});

// the schema is useless so far
// we need to create a model using it
var Students = mongoose.model('Student', studentSchema);

// make this available to our Node applications
module.exports = Students;
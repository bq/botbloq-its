// grab the things we need
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
    },
    address: {
        type: String,
		required: false
    },
    phone: {
        type: String,
		required: false
    },
    type: {
        type: String,
		required: false,
		enum: [
			'beginner',
			'medium',
			'advanced'
		]
    },
	_id: false
});

var learningStyleSchema = new Schema({
    type: {
        type: String,
		required: false
    },
    comprehension: {
        type: String,
		required: false,
		enum:[
			'sequential',
			'global'
		]
    },
    input: {
        type: String,
		required: false,
		enum:[
			'visual',
			'verbal'
		]
    },
    perception: {
        type: String,
		required: false,
		enum: [
			'sensing',
			'intuitive'
		]
    },
    processing: {
        type: String,
		required: false,
		enum: [
			'active',
			'reflexive'
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

var courseSchema = new Schema({
	idCourse: {
		type: String,
		required: false
	},
	idSection: {
		type: String,
		required: false
	},
	idLesson: {
		type: String,
		required: false
	},
	idLom: {
		type: String,
		required: false
	},
	status: {
		type: Number,
		required: false,
		default: 0
	},	
	active: {
		type : Number,
		required: false,
		default: 1
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	_id: false
});

var activitySchema = new Schema({
	idCourse: {
		type: String,
		required: false
	},
	idSection: {
		type: String,
		required: false
	},
	idLesson: {
		type: String,
		required: false
	},
	idLom: {
		type: String,
		required: false
	},
	status: {
		type: Number,
		required: false
	},
	duration: {
		type: Number,
		required: false
	},
	hints: {
		type: Number,
		default: 0
	},
	attemps: {
		type: Number,
		required: false
	},
	created_at: {
		type: Date,
		default: Date.now
	}
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
	active:{
		type: Number,
		required: false,
		default: 1
	},
    course: [courseSchema],
	activity_log: [activitySchema]
});

// the schema is useless so far
// we need to create a model using it
var Students = mongoose.model('Student', studentSchema);

// make this available to our Node applications
module.exports = Students;
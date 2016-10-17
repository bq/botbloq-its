// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var identificationSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    type: {
        type: String,
    }
});

var learningStyleSchema = new Schema({
    type: {
        type: String,
    },
    comprension: {
        type: String,
    },
    entrada: {
        type: String,
    },
    percepcion: {
        type: String,
    },
    procesamiento: {
        type: String,
    }
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
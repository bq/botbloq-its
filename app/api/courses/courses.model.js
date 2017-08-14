'use strict';
/* jshint node: true */

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
      										
var LOM = new Schema({ 
	lom_id: String,
	type: String,
	_id: false 
});
	
var Objective = new Schema({
	code: String,
	description: String,
	level: Number,
	bloom: {
		type: String,
		enum: ['knowledge', 'comprehension', 'application', 
		'analysis', 'sintehsis', 'evaluation']
	},
	_id: false
});

var Lesson = new Schema({ 
	name: { type: String, required: true}, 
	summary: {type: String, default: '--'}, 
	description: {type: String, default: '--'},
	objectives: [Objective],
	learning_path: [Number],
	photo: String,
	dificulty : { type: Number, default: 0},
	type: {
		type: String,
		enum: ['Reinforcement', 'Essential', 'Extension'],
		default: 'Essential' 
	},
	loms : [LOM],
	_id: false
});

var Section = new Schema({ 
	name: {type: String, required: true}, 
	summary  : {type: String, default: 'no summary'}, 
	objectives: [Objective],
	lessons  : [Lesson],
	_id: false
});

var Statistics = new Schema({
	std_enrolled : [String],
	std_finished : [String],
	std_unenrolled : [String],
	_id: false
});

var History = new Schema({
	id: String,
	lesson: Number,
	_id: false
});

var Solution = new Schema({
	idStudent: String,
	idCourse: String,
	idSection: String,
	idLesson: String,
	idLom: String,
	solution: String,
	_id: false
});

	
var CoursesSchema = new mongoose.Schema({
	name: { type: String, trim: true, required: true, unique: true },
	code: { type: String , default: 'no code'},
	summary: { type: String, trim: true, default: 'no summary' },
	objectives: [Objective],
	sections  : [Section],
	photo: String,
	author: String,
	statistics: {type: Statistics, required: true, default: ''},
	history: [History],
	solutions: [Solution]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
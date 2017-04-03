'use strict';
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
	}
});

var Lesson = new Schema({ 
		name: { type: String, required: true}, 
		summary: {type: String, default: 'no summary'},  
		objectives: [Objective],
		learning_path: [Number],
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
	
var CoursesSchema = new mongoose.Schema({
	name: { type: String, trim: true, required: true, unique: true },
	code: { type: String , default: 'no code'},
	summary: { type: String, trim: true, default: 'no summary' },
	objectives: [Objective],
	sections  : [Section],
	statistics: {type: Statistics, required: true, default: ''},
	history: [String]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
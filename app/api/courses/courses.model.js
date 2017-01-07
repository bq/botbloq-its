'use strict';
var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;
      										
var LOM = new Schema({ 
	lom_id: String,
	_id: false 
});
	
var Objective = new Schema({
	code: String,
	description: String,
	level: Number,
	bloom: {
		type: String,
		enum: ['knoweldge', 'comprehension', 'application', 
		'analysis', 'sintehsis', 'evaluation']
	}
});

var Lesson = new Schema({ 
		name: String, 
		summary: String,  
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
	name: String, 
	summary  : String, 
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
	name: { type: String, trim: true, required: true },
	code: { type: String },
	summary: { type: String, trim: true },
	objectives: [Objective],
	sections  : [Section],
	statistics: {type: Statistics},
	history: [String]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
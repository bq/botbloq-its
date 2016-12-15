'use strict';
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
      										
var LOM = new Schema({ 
	lom_id: String,
	_id: false 
});
	
var Objective = new Schema({
	description: String,
	bloom_domain: {
		type:String,
		enum:["cognitive", "affective", "psychomotor"]
	},		
	domain: {
		type:String,
		enum:[
		"Applying", "Analyzing", "Synthesizing", "Evaluating",
		"Receiving", "Responding", "Valuing", "Organizing", "Characterizing",
		"Perception", "Set", "Guided response", "Mechanism", "Complex overt response", 
				"Adaptation", "Origination"
		]
	}
});

var Lesson = new Schema({ 
		name: String, 
		resume: String,  
		objectives: [Objective],
		learning_path: [Number],
		type: {
			type: String,
			enum: ["Reinforcement", "Essential", "Extension"],
			default: "Essential" 
		},
		loms : [LOM],
		_id: false
});

var Section = new Schema({ 
	name: String, 
	resume  : String, 
	objectives: [Objective],
	lessons  : [Lesson],
	_id: false
});
	
var CoursesSchema = new mongoose.Schema({
	name: { type: String, trim: true, required: true },
	code: { type: String, index: { unique: true } },
	content: { type: String, trim: true },
	objectives: [Objective],
	sections  : [Section],
	history: [String]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
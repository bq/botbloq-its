'use strict';

// var mongoose = require('mongoose');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
      										
var LOM = new Schema( // { autoIndex: false },
	{ lom_id: String } 
	);
	
var Objective = new Schema(
	{
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

var Lesson = new Schema( // { autoIndex: false },
	{ 
	name: String, 
	resume  : String,  
	objetives: [Objective],
	loms : [LOM] }
	);

var Section = new Schema( // { autoIndex: false },
	{ 
	name: String, 
	resume  : String, 
	objetives: [Objective],
	lessons  : [Lesson]}
	);
	
var CoursesSchema = new mongoose.Schema(
	{
	name: { type: String, trim: true, required: true },
	code: { type: String, index: { unique: true } },
	content: { type: String, trim: true },
	objetives: [Objective],
	bibliography: { type: String, trim: true },
	sections  : [Section]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
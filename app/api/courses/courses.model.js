'use strict';

// var mongoose = require('mongoose');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  					
var Lo = new Schema({
	name: String,
	lo : String	
})

var Lesson = new Schema({
	name: String,
    resume  : String,
	los : [Lo]	
})

var Section = new Schema({
	name: String,
    resume  : String, 
	lessons  : [Lesson]
});

var CoursesSchema = new mongoose.Schema(
	{
	"name": { type: String, trim: true, required: true },
	"content": { type: String, trim: true },
	"objetives": { type: String, trim: true },
	"bibliography": { type: String, trim: true },
	// "sections": {type: object, trim: true }
	sections  : [Section]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
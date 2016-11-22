'use strict';

// var mongoose = require('mongoose');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
  										
var Lo = new Schema( // { autoIndex: false },
	{ lom_id: String } 
	);

var Lesson = new Schema( // { autoIndex: false },
	{ name: String, resume  : String, los : [Lo] }
	);

var Section = new Schema( // { autoIndex: false },
	{ name: String, resume  : String, lessons  : [Lesson]}
	);

var CoursesSchema = new mongoose.Schema(
	{
	"name": { type: String, trim: true, required: true },
	"code": { type: String, index: { unique: true } },
	"content": { type: String, trim: true },
	"objetives": { type: String, trim: true },
	"bibliography": { type: String, trim: true },
	sections  : [Section]
	}, 
	{ timestamps: true }
	);
	
module.exports = mongoose.model('Courses', CoursesSchema);
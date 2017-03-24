'use strict';

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generalSchema = new Schema({
	id_catalog: {
		type: String,
		default: 'botbloq'
	},	
	id_entry: {
		type: Number,
		default: 0	
	},
	title: {
		type: String,
		default: 'No title'
	},
	language: {
		type: String,
		enum: [
			'es',
			'en'
		],
		default: 'en'
	},
	structure: {
		type: String,
		enum: [
			'atomic',
			'complex'
		],
		default: 'atomic'
	},
	aggregation_level: {
		type: Number,
		default: 1
	},
	_id : false
});

generalSchema.methods = {
    /**
     * increaseCounter - Increase the counter
     *
     * @param {Number} addNumber
     * @param {Function} callback
     * @api public
     */

    increaseCounter: function(number, callback) {
        this.id_entry = this.id_entry + number;
        callback(null, this.id_entry);
    }
};

var lifecycleSchema = new Schema({
	version: {
		type: Number,
		default: 1
	},
	state: {
		type: String,
		enum: [
			'draft',
			'final'
		],
		default: 'final'
	},
	contribution_type: {
		type: String,
		default: 'no type'
	},
	contribution_entity: {
		type: String,
		default: 'no entity'
	},
	contribution_date: {
		type: Date,
		default: Date.now
	},
	_id : false
});


var metadataSchema = new Schema({
	contribution_type: {
		type: String,
		default: 'no type'
	},
	contribution_entity: {
		type: String,
		default: 'no entity'
	},
	contribution_date: {
		type: Date,
		default: Date.now
	},
	_id : false
});

var technicalSchema = new Schema({
	format: {
		type: String,
		default: 'no format'
	},
	size_kb: {
		type: Number,
		default: 100
	},
	url: {
		type: String,
		default: 'no URL'
	},
	_id : false
});

var useSchema = new Schema({
	interactivity_type: {
		type: String,
		default: 'no interactivity type'
	},
	interactivity_level: {
		type: String,
		default: 'no interactivity level'
	},
	language: {
		type: String,
		default: 'English'
	},	
	resource_type: {
		type: String,
		default: 'no resource type'
	},
	resource_target: {
		type: String,
		default: 'no resource target'
	},
	resource_context: {
		type: String,
		default: 'no resource context'
	},
	resource_difficulty: {
		type: String,
		default: 'no resource difficulty'
	},
	_id : false
});

var lomSchema = new Schema({
	general: {
		type: generalSchema,
		required: true,
		default: ''
	},
	lifecycle: {
		type: lifecycleSchema,
		required: true,
		default: ''
	},
	metadata: {
		type: metadataSchema,
		required: true,
		default: ''
	},
	technical: {
		type: technicalSchema,
		required: true,
		default: ''
	},
	use: {
		type: useSchema,
		required: true,
		default : ''
	}
});



// the schema is useless so far
// we need to create a model using it
var LOMS = mongoose.model('LOM', lomSchema);

// make this available to our Node applications
module.exports = LOMS;
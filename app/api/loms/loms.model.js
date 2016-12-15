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
		type: String
	},
	language: {
		type: String,
		enum: [
			'es',
			'en'
		]
	},
	structure: {
		type: String,
		enum: [
			'atomic',
			'complex'
		]
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
		type: String
	},
	contribution_entity: {
		type: String
	},
	contribution_date: {
		type: Date,
		default: Date.now
	},
	_id : false
});


var metadataSchema = new Schema({
	contribution_type: {
		type: String
	},
	contribution_entity: {
		type: String
	},
	contribution_date: {
		type: Date,
		default: Date.now
	},
	_id : false
});

var technicalSchema = new Schema({
	format: {
		type: String
	},
	size_kb: {
		type: Number
	},
	url: {
		type: String
	},
	_id : false
});

var useSchema = new Schema({
	interactivity_type: {
		type: String
	},
	interactivity_level: {
		type: String
	},
	language: {
		type: String
	},	
	resource_type: {
		ttype: String
	},
	resource_target: {
		type: String
	},
	resource_context: {
		type: String
	},
	resource_difficulty: {
		type: String
	},
	_id : false
});

var lomSchema = new Schema({
	general: {
		type: generalSchema,
		required: false,
		default: ''
	},
	lifecycle: {
		type: lifecycleSchema,
		required: false,
		default: ''
	},
	metadata: {
		type: metadataSchema,
		required: false,
		default: ''
	},
	technical: {
		type: technicalSchema,
		required: false,
		default: ''
	},
	use: {
		type: useSchema,
		required: false,
		default : ''
	}
});



// the schema is useless so far
// we need to create a model using it
var LOMS = mongoose.model('LOM', lomSchema);

// make this available to our Node applications
module.exports = LOMS;
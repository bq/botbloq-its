'use strict';
/* jshint node: true */

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
			'collection',
			'networked',
			'hierarchical',
			'linear'
		],
		default: 'atomic'
	},
	aggregation_level: {
		type: Number,
		default: 1
	},

	///////////////////////////////////////

	description: {
		type: String,
		required: false
	},
	keyword: {
		type: String,
		required: false
	},
	ambit: {
		type: String,
		required: false
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
		enum: [
			'',
			'creator',
			'validator'
		],
		default: ''
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
		enum: [
			'',
			'doc',
			'acrobat',
			'webPage',
			'textFile',
			'excel',
			'powerPoint',
			'flash',
			'MIDIsound',
			'MPEGsound',
			'WAVEsound',
			'realSound',
			'BMPimage',
			'GIFimage',
			'JPGimage',
			'PNGimage',
			'AVIvideo',
			'MPGvideo',
			'QuickTimeVideo',
			'realVideo',
			'videoMediaPlayer',
			'windowsMediaVideo',
			'flashVideo'
		],
		default: ''
	},
	size_kb: {
		type: Number,
		default: 100
	},
	url: {
		type: String,
		default: 'no URL'
	},
	requirements_type: {
		type: String,
		required: false
	},
	requirements_name: {
		type: String,
		required: false
	},
	requirements_minimal_version: {
		type: String,
		required: false
	},
	requirements_maximal_version: {
		type: String,
		required: false
	},
	installation_guidelines: {
		type: String,
		required: false
	},
	other_requirements: {
		type: String,
		required: false
	},
	duration: {
		type: Number,
		required: false
	},
	_id : false
});

var useSchema = new Schema({
	interactivity_type: {
		type: String,
		enum: [
			'',
			'active',
			'expository',
			'combinative'
		],
		default: '',
		required: false		
	},
	interactivity_level: {
		type: String,
		enum: [
			'',
			'veryLow',
			'low',
			'medium',
			'high',
			'veryHigh'
		],
		default: ''
	},
	language: {
		type: String,
		enum: [
			'',
			'es',
			'en'
		],
		default: 'es'
	},	
	resource_type: {
		type: String,
		enum: [
			'',
			'pic',
			'ilustration',
			'video',
			'animation',
			'music',
			'soundEfect',
			'locution',
			'compuestAudio',
			'narrativeText',
			'hypertext',
			'graphicPc',
			'integrateMedia',
			'bbdd',
			'table',
			'grapich',
			'conceptualMap',
			'navigation',
			'mapNavigation',
			'digitalDic',
			'digitalEnc',
			'periodicdigitalPublication',
			'web',
			'wiki',
			'weblog',
			'creationEditMul',
			'creationEditWeb',
			'office',
			'programming',
			'analitic',
			'support',
			'manage',
			'createEditMulService',
			'officeService',
			'programmingService',
			'analiticService',
			'serviceSupport',
			'serviceManage',
			'lecture',
			'lesson',
			'coment-text-image',
			'activityArgue',
			'closeExercise',
			'contextualizeCase',
			'openProblem',
			'virtual',
			'didacticPlay',
			'webquest',
			'experiment',
			'realProyect',
			'simulation',
			'questionnaire',
			'exam',
			'autoEvaluation',
			'presentationMul'
		],
		default: ''
	},
	resource_target: {
		type: String,
		default: 'no resource target'
	},
	resource_context: {
		type: String,
		enum: [
			'',
			'basicEducation',
			'highEducation',
			'capacity',
			'other'
		],
		default: ''
	},
	resource_difficulty: {
		type: String,
		enum: [
			'basic',
			'medium',
			'advanced'
		],
		default: 'medium'
	},

	///////////////////////////////////////

	semantic_density: {
		type: String,
		required: false
	},
	typical_age_range: {
		type: String,
		required: false
	},
	typical_learning_time: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: false
	},
	cognitive_process: {
		type: String,
		required: false
	},
	_id : false
});

var photoSchema = new Schema({ 
	data: Buffer, 
	contentType: String,
	_id: false
});

var lomSchema = new Schema({
	author:{
        type:String,
        required: false,
        default: 'unknown author'
    },
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
	},
	photo: {
		type: String,
		required: false,
		default: ''
	}
});



// the schema is useless so far
// we need to create a model using it
var LOMS = mongoose.model('LOM', lomSchema);

// make this available to our Node applications
module.exports = LOMS;
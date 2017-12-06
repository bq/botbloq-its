'use strict';
var mongoose = require('mongoose'),
lomModel = require('../app/api/loms/loms.model.js'),
fs = require('fs');


var LOM = function() {
    this.generateRandomLOM = function(titleLOM, urlVideo, formatLOM) {
        var lom = {
			general: {
				title: titleLOM,
				language: 'es',
				structure: 'atomic'
			},
			lifecycle: {
				state: 'final',
				contribution_type: 'video'
			},
			technical: {
				format: formatLOM,
				url: urlVideo
			}
			// TODO expand metadata
			//_id: mongoose.Types.ObjectId()
        };
        return lom;
    };
	
	this.generate3LOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM('Scratch: Zowi charla con el gato', 'http://diwo.bq.com/video/curso-scratch-sesion-1/', 'video'));
		loms.push(this.generateRandomLOM('Scratch: Zowi camina por la luna', 'http://diwo.bq.com/video/curso-scratch-sesion-2/', 'video'));
		loms.push(this.generateRandomLOM('Scratch: moviendo a Zowi', 'http://diwo.bq.com/video/curso-scratch-sesion-3/', 'video'));
		
		return loms;
	};
	
	this.generateZowiLOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM('Scratch: Zowi charla con el gato', 'http://diwo.bq.com/video/curso-scratch-sesion-1/', 'video'));
		loms.push(this.generateRandomLOM('Scratch: Zowi camina por la luna', 'http://diwo.bq.com/video/curso-scratch-sesion-2/', 'video'));
		loms.push(this.generateRandomLOM('Scratch: moviendo a Zowi', 'http://diwo.bq.com/video/curso-scratch-sesion-3/', 'video'));
		return loms;
	};

	this.generateComplexLOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM('sesion00', 'video url', 'video'));
		loms.push(this.generateRandomLOM('sesion01', 'audio url', 'audio'));
		loms.push(this.generateRandomLOM('sesion02', 'practice url', 'practice'));
		loms.push(this.generateRandomLOM('sesion03', 'document url', 'document'));
		loms.push(this.generateRandomLOM('sesion04', 'practice url', 'practice'));
		loms.push(this.generateRandomLOM('sesion05', 'document url', 'document'));
		loms.push(this.generateRandomLOM('sesion06', 'video url', 'video'));
		loms.push(this.generateRandomLOM('sesion07', 'audio url', 'audio'));
		
		return loms;
	};
		
	this.generateBitbloqLOMS = function(path) {
		var files = fs.readdirSync(path), loms = [], ret = [];
		
		for (var i = 0; i < files.length; i++){
			var file = files[i];
			if(file !== '.DS_Store'){
				var index = parseInt(file.split('.', 1)) - 1;
				loms[index] = new lomModel(require(path + file));
			}
		}
		for(var i = 0; i <= loms.length; i++){
			if(loms[i] !== undefined) {ret.push(loms[i]);}
		}
		return ret;
	};
};

module.exports = LOM;
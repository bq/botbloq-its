'use strict';
var mongoose = require('mongoose'),
lomModel = require('../../app/api/loms/loms.model.js'),
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
		loms.push(this.generateRandomLOM('lom0', '', 'video'));
		loms.push(this.generateRandomLOM('lom1', '', 'video'));
		loms.push(this.generateRandomLOM('lom2', '', 'video'));
		
		return loms;
	};
	
	this.generateZowiLOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM('sesion00', 'https://youtu.be/PzPrX1JU5Pw?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion01', 'https://youtu.be/hprno1wRpHc?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion02', 'https://youtu.be/tuUjFOdtq5Q?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion03', 'https://youtu.be/hpSVzBJFQTw?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion04', 'https://youtu.be/3zspOSGqzrc?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion05', 'https://youtu.be/aNR9E-1Vkf0?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion06', 'https://youtu.be/2dQ5RB8BMLo?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion07', 'https://youtu.be/HuoBCLkdmNU?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion08', 'https://youtu.be/5nnshdYPymQ?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion09', 'https://youtu.be/hUJ2RJDzqFY?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		loms.push(this.generateRandomLOM('sesion10', 'https://youtu.be/kV_5hH8IUDQ?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu', 'application/youtube'));
		
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
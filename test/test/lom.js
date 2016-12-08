'use strict';
var mongoose = require('mongoose');

var LOM = function() {
    this.generateRandomLOM = function(titleLOM, urlVideo) {
        var lom = {
			general: {
				title: titleLOM,
				language: "es",
				structure: "atomic"
			},
			lifecycle: {
				state: "final",
				contribution_type: "video"
			},
			technical: {
				format: "application/youtube",
				url: urlVideo
			}
			// TODO expand metadata
			//_id: mongoose.Types.ObjectId()
        };
        return lom;
    };
	
	this.generate3LOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM("lom0"));
		loms.push(this.generateRandomLOM("lom1"));
		loms.push(this.generateRandomLOM("lom2"));
		
		return loms;
	};
	
	this.generateZowiLOMS = function() {
		var loms = [];
		loms.push(this.generateRandomLOM("sesion00", "https://youtu.be/PzPrX1JU5Pw?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion01", "https://youtu.be/hprno1wRpHc?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion02", "https://youtu.be/tuUjFOdtq5Q?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion03", "https://youtu.be/hpSVzBJFQTw?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion04", "https://youtu.be/3zspOSGqzrc?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion05", "https://youtu.be/aNR9E-1Vkf0?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion06", "https://youtu.be/2dQ5RB8BMLo?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion07", "https://youtu.be/HuoBCLkdmNU?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion08", "https://youtu.be/5nnshdYPymQ?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion09", "https://youtu.be/hUJ2RJDzqFY?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		loms.push(this.generateRandomLOM("sesion10", "https://youtu.be/kV_5hH8IUDQ?list=PL_AaWt7YXUYgKKAeIDcUmSj0f8Z5FwCeu"));
		
		return loms;
	}
	
};

module.exports = LOM;
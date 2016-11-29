'use strict';
var mongoose = require('mongoose');

var LOM = function() {
    this.generateRandomLOM = function() {
        var lom = {
			general: {
				title: "Zowie charla con Gato",
				language: "es",
				structure: "atomic"
			}
			// TODO expand metadata
			//_id: mongoose.Types.ObjectId()
        };
        return lom;
    };
};

module.exports = LOM;
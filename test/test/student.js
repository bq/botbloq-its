'use strict';
var mongoose = require('mongoose');

var Student = function() {
    this.generateRandomStudent = function() {
        var student = {
			identification: {
				name: "Pepe",
				email: "pepe@gmail.com"
			}
			//_id: mongoose.Types.ObjectId()
        };
        return student;
    };
};

module.exports = Student;
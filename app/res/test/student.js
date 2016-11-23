'use strict';
var mongoose = require('mongoose');

var Student = function() {
    this.generateRandomStudent = function() {
        var student = {
			identification: {
				name: "Alvaro",
				email: "alvaro@gmail.com",
				address: "calle Toledo, n 100, piso 3A",
				phone: "305710583",
				type: "beginner"
			},
			learningStyle: {
				type: "",
				comprehension: "",
				input: "",
				perception: "",
				processiong: ""
			},
			knowledgeLevel: {
				name: "",
				level: "",
				target: ""
			},
			
			active: 1,
			
			course: [{
				idCourse: "",
				idLom: "",
				status: 0,
				active: 1
			}], 
			_id: mongoose.Types.ObjectId()
        };
        return student;
    };
};
module.exports = Student;
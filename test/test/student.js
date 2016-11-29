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

    this.generateAnswer = function() {
    	var answer = { 
    		answers : [ 
    		{id_question : "ls_comp", value: "sequential"},
    		{id_question : "ls_input", value: "visual"},
    		{id_question : "ls_per", value: "sensing"},
    		{id_question : "ls_proc", value: "active"}
    	]};
    	return answer;


    }
};

module.exports = Student;
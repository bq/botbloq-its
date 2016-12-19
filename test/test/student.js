'use strict';
var mongoose = require('mongoose');

var Student = function() {
    this.generateRandomStudent = function(nameStudent, emailStudent) {
				
        var student = {
			identification: {
				name:  nameStudent,
				email: emailStudent
			}
        };
        return student;
    };
	
	this.generateCompleteStudent = function() {
		var student = {
			identification: {
				name: 'antonio',
				email: 'antonio@gmail.com',
				address: 'Toledo st, 25',
				phone: '593018562',
				type: 'beginner'
			}
		};
		return student;
	}

    this.generateAnswer = function() {
    	var answer = { 
    		answers : [ 
    		{id_question : 'ls_comp', value: 'sequential'},
    		{id_question : 'ls_input', value: 'visual'},
    		{id_question : 'ls_per', value: 'sensing'},
    		{id_question : 'ls_proc', value: 'active'}
    	]};
    	return answer;


    }
};

module.exports = Student;
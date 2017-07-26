'use strict';
var mongoose = require('mongoose');

var Student = function() {
    this.generateRandomStudent = function(nameStudent, emailStudent) {
				
        var student = {
			identification: {
				name:  nameStudent,
				email: emailStudent
			},
			learningStyle: {
				comprehension: 'global',
    			input: 'visual',
    			perception: 'sensitiva',
    			processing: 'activa'
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
	};

    this.generateAnswer = function(answers) {
    	var answer = { 
    		answers : { answers : [
       	    {id_question : 'ls_comp', value: answers[0]},
    		{id_question : 'ls_input', value: answers[1]},
    		{id_question : 'ls_per', value: answers[2]},
    		{id_question : 'ls_proc', value: answers[3]}
    	]} };
    	return answer;
    };

    this.generateRuleStudent = function(units, problems, steps, c_steps, duration, hints, skills) {
    	var student = {
			"units" : units,
			"problems" : problems,
			"steps": steps,
			"corrects_steps": c_steps,
			"duration" : duration,
			"hints": hints,
			"skills" :skills
    	};

    	 return student;
    };
};

module.exports = Student;
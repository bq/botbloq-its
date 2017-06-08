var chakram = require('chakram'),
	mongoose = require('mongoose'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	course = new Course(),
	lomModel = require('../app/api/loms/loms.model.js'),
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request();
	
var idStudent, idCourse, idLOM, nameCourse, idLoms = [], bitbloqCourse;


	
describe('Chakram', function(){
	
	it('Testing to reset the database', function(){
		return request.deleteBackend('/loms',200).then(function (response) {
			return request.getBackend('/loms',200).then(function (response1) {
				expect(response1.body).to.be.empty;
				
				return request.deleteBackend('/courses',200).then(function (response2) {
					return request.getBackend('/courses',200).then(function (response3) {
					expect(response3.body).to.be.empty;
					
						return request.deleteBackend('/students',200).then(function (response4) {
							return request.getBackend('/students',200).then(function (response5) {		
							expect(response5.body).to.be.empty;
							chakram.wait();
							});
						});
					});
				});
			});
		});	
	});

	it('Testing to create a new student', function () {
		console.log('------------------------------------------');
		console.log('--------------- bitbloq2 -----------------');
		console.log('------------------------------------------');
 	    var randomStudent = student.generateRandomStudent('pepe','pepe@gmail.com');
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body._id;
	    	chakram.wait();
	    	
 	    });
	 });
	 
  	it('Testing to create the bitbloq2 LOMS ', function(){
  		var message, path = '../app/res/LOM-JSON/partial/';
  		var loms = lom.generateBitbloqLOMS(path);
	    return request.postBackend('/loms',200,loms[0]).then(function (response) {
  	    	message = response.body;
  	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 		    return request.postBackend('/loms',200,loms[1]).then(function (response) {
 	 	    	message = response.body;
 	 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 			    return request.postBackend('/loms',200,loms[2]).then(function (response) {
 		 	    	message = response.body;
 		 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 				    return request.postBackend('/loms',200,loms[3]).then(function (response) {
 			 	    	message = response.body;
 			 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 					    return request.postBackend('/loms',200,loms[4]).then(function (response) {
 				 	    	message = response.body;
 				 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 						    return request.postBackend('/loms',200,loms[5]).then(function (response) {
 					 	    	message = response.body;
 					 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 							    return request.postBackend('/loms',200,loms[6]).then(function (response) {
 						 	    	message = response.body;
 						 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 								    return request.postBackend('/loms',200,loms[7]).then(function (response) {
 							 	    	message = response.body;
 							 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 									    return request.postBackend('/loms',200,loms[8]).then(function (response) {
 								 	    	message = response.body;											
 								 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 										    return request.postBackend('/loms',200,loms[9]).then(function (response) {
 									 	    	message = response.body;
 									 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
 											    return request.postBackend('/loms',200,loms[10]).then(function (response) {
 										 	    	message = response.body;
 										 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
													chakram.wait();
 												});
 											});
 										});
 									});
 								});
 							});
 						});
 					});
 				});
 			});
 		});
 	});
	
 	it('Testing to create Bitbloq course and enroll a student', function() {
 		var message;		
 		bitbloqCourse = course.generateBitbloqCourse(idLoms);

 		return request.postBackend('/courses', 200, bitbloqCourse).then(function (response) { 
 			message = response.body;
 	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);

			
 			// Testing if the course is in the database
 			return request.getBackend('/courses/' + idCourse, 200).then(function(response2) {
 				expect(response2.body.code).to.equal(bitbloqCourse.code);

				
 				// enrolling the student in the course
 				return request.putBackend('/students/'+ idStudent + '/course/' + idCourse,200)
 				.then(function(response3) {
		
 					// testing if the student is already enrolled in the course
 					expect(response3.body).to.have.property('idCourse', idCourse);
 					chakram.wait();
 				});
 			});
 		});
 	});
	
	it('Testing the sequential operation of the Bitbloq course', function() {
		var lom;
    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
		.then(function(response) {
			expect(response.body.general).to.have.property('title', 'Antes de empezar con Bitbloq 2');
			lom = response.body._id;
			console.log('The system returns the first lesson of the course: 1. Antes de empezar');
			var solution = {sol1: 'hola que tal', sol2: 'todo bien'};
			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/idle',  200)
			.then(function (response2) {
				console.log(response2.body);
				return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response) {
					console.log(response.body);
					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/finalize',  200, solution)
					.then(function (response2) {
						expect(response2.body).to.equals('The solution was successfully sent');
						console.log('The system returns: The solution was successfully sent');
						chakram.wait();
					});
				});
			});
		});
	});
	
});
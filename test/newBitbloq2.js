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
		console.log('-------------- newBitbloq2 ---------------');
		console.log('------------------------------------------');
		
 	    var randomStudent = student.generateRandomStudent('pepe','pepe@gmail.com');
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body.id_student;
	    	var answer = student.generateAnswer(['sequential', 'visual', 'sensing', 'active']);
	    	// update learning style
	    	return request.postBackend('/students/' + idStudent + '/init', 200,answer ).then(function (response1) {
				// data verification
		    	return request.getBackend('/students/' + idStudent, 200).then(function (response2) {
		    		expect(response2.body.learningStyle.processing).to.equal('active');
	 	    		expect(response2.body.identification.name).to.equal(randomStudent.identification.name);
	 	    		chakram.wait();
 	    
 	    		});

	    	});
	    	
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
	
 	it('Testing to create Bitbloq introduction course and enroll a student', function() {
 		var message;		
 		bitbloqCourse = course.generateBitbloqIntroduction(idLoms);
 		return request.postBackend('/courses', 200, bitbloqCourse).then(function (response) { 
 			message = response.body;
 	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
			
 			// Testing if the course is in the database
 			return request.getBackend('/courses/' + idCourse, 200).then(function(response2) {
 				expect(response2.body.code).to.equal(bitbloqCourse.code);

 				return request.putBackend('/students/'+ idStudent + '/group',200).then(function(response3) {
					expect(response3.body).to.have.property('group', 1);
				
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
 	});
	
	it('Testing the sequential operation of the Bitbloq introduction', function() {
		var lom;
    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
		.then(function(response) {
			expect(response.body.general).to.have.property('title', 'Antes de empezar con Bitbloq 2');
			lom = response.body._id;
			console.log('The system returns the first lesson of the course: 1. Antes de empezar');
			

			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/idle', 200)
			.then(function (response2) {
				expect(response2.body).to.equal('The activity has been paused correctly');
				console.log('The activity has been paused');
				
				return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response) {
					expect(response.body.general).to.have.property('title', 'Antes de empezar con Bitbloq 2');
					lom = response.body._id;
					console.log('The system returns the first lesson of the course: 1. Antes de empezar');

					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
					.then(function (response2) {
						expect(response2.body).to.have.property('status', 1);

				    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
						.then(function(response) {
							expect(response.body.general).to.have.property('title', 'Conociendo bitbloq 2');
							lom = response.body._id;
							console.log('The system returns the second lesson of the course: 2. Conociendo el entorno');
						
							return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
							.then(function (response2) {
								expect(response2.body).to.have.property('status', 1);
					
						    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
								.then(function(response) {
									expect(response.body[0].level).to.equal(1);
									console.log('Course finished');
									chakram.wait();
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
			expect(response.body.general).to.have.property('title', '¿Que es un robot? Conociendo sensores y actuadores');
			lom = response.body._id;
			console.log('The system returns the third lesson of the course: 3. Que es un robot, Because the first and second have already been coursed');
			
			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
			.then(function (response2) {
				expect(response2.body).to.have.property('status', 1);
		    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response) {
					expect(response.body.general).to.have.property('title', '¡Aprende a pensar como un robot! Los algoritmos');
					lom = response.body._id;
					console.log('The system returns the eighth lesson of the course: 8. Algoritmos');
					
					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
					.then(function (response2) {
						expect(response2.body).to.have.property('status', 1);
				    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
						.then(function(response) {
							expect(response.body.general).to.have.property('title', 'Y la luz se hizo: programando los LED en bitbloq 2');
							lom = response.body._id;
							console.log('The system returns the fourth lesson of the course: 4. LED');
							
							return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
							.then(function (response2) {
								expect(response2.body).to.have.property('status', 1);
						    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
								.then(function(response) {
									expect(response.body.general).to.have.property('title', '¡Muévete! El servo de rotación continua');
									lom = response.body._id;
									console.log('The system returns the fifteenth lesson of the course: 15. El servo de rotacion continua');
									
									return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
									.then(function (response2) {
										expect(response2.body).to.have.property('status', 1);
								    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
										.then(function(response) {
											expect(response.body.general).to.have.property('title', 'Si tú me dices ven… lo dejo todo, o no. Las sentencias condicionales y el pulsador.');
											lom = response.body._id;
											console.log('The system returns the fifth lesson of the course: 5. Condicionales');
											
											return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
											.then(function (response2) {
												expect(response2.body).to.have.property('status', 1);
										    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
												.then(function(response) {
													expect(response.body.general).to.have.property('title', 'Piruru piii… Programando el zumbador');
													lom = response.body._id;
													console.log('The system returns the ninth lesson of the course: 9. El zumbador');
													
													return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
													.then(function (response2) {
														expect(response2.body).to.have.property('status', 1);
												    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
														.then(function(response) {
															expect(response.body.general).to.have.property('title', 'O blanco o negro. El sensor infrarrojo.');
															lom = response.body._id;
															console.log('The system returns the tenth lesson of the course: 10. Sensor IR');
															
															return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
															.then(function (response2) {
																expect(response2.body).to.have.property('status', 1);
														    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
																.then(function(response) {
																	expect(response.body.general).to.have.property('title', 'Ve hacia la luz robotín… programando el sensor de luz');
																	lom = response.body._id;
																	console.log('The system returns the twelve lesson of the course: 12. Sensor Luz');
															
																	return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
																	.then(function (response2) {
																		expect(response2.body).to.have.property('status', 1);
																    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
																		.then(function(response) {
																			expect(response.body[1].level).to.equal(2);
																			console.log('Course finished');
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
						});
					});
				});
			});
		});
	});
	
});
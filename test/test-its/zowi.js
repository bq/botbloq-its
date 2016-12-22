var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	course = new Course(),
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request();
	
var idStudent, idCourse, idLOM, nameCourse, idLoms = [], zowiCourse;
	
describe('Chakram', function(){

	it('Testing to create a new student', function () {
 	    var randomStudent = student.generateRandomStudent('pepe','pepe@gmail.com');
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body.id_student;
	    	var answer = student.generateAnswer();
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

 	it('Testing tu create the Zowi LOMS ', function(){
 		var message;
 		var loms = lom.generateZowiLOMS();
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
	
	it('Testing to create Zowi course and enroll a student', function() {
		var message;
		zowiCourse = course.generateZowiCourse(idLoms);
		return request.postBackend('/courses', 200, zowiCourse).then(function (response) { 
			message = response.body;
	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
			
			// Testing if the course is in the database
			return request.getBackend('/courses/' + zowiCourse.name, 200).then(function(response2) {
				expect(response2.body[0].code).to.equal(zowiCourse.code);
				
				// enrolling the student in the course
				return request.putBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
				.then(function(response3) {
		
					// testing if the student is already enrolled in the course
					expect(response3.body).to.have.property('idCourse', zowiCourse.name);
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing the sequential operation of the Zowi course', function() {
		var lom;
    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
		.then(function(response) {
			expect(response.body.general).to.have.property('title', 'sesion00');
			console.log('The system returns the first activity of the course');
			lom = response.body._id;
			return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
			.then(function (response2) {
				expect(response2.body.course[0]).to.have.property('status', 1);
		    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
				.then(function(response3) {
					expect(response3.body.general).to.have.property('title', 'sesion01');
					lom = response3.body._id;
					console.log('The system returns the second activity of the course');
					
					
					return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/nok', 200) 			////// 
					.then(function (response4) {																							//////
						expect(response4.body.course[0]).to.have.property('status', -1);													//////
				    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)								//////    testing
						.then(function(response5) {																							//////      nok
							expect(response5.body.general).to.have.property('title', 'sesion01');											//////
							console.log('The system returns the same activity because it did not finish correctly');						//////   situation
							lom = response5.body._id;																						//////
							return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)		//////
							.then(function (response4) {																					//////
								expect(response4.body.course[0]).to.have.property('status', 1);												//////
						    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)						//////
								.then(function(response5) {																					//////
									expect(response5.body.general).to.have.property('title', 'sesion02');									//////
									lom = response5.body._id;																				//////
									console.log('The system returns the third activity of the course');
									
									
									return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
									.then(function (response6) {
										expect(response6.body.course[0]).to.have.property('status', 1);
								    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
										.then(function(response7) {
											expect(response7.body.general).to.have.property('title', 'sesion03');
											lom = response7.body._id;
											console.log('The system returns the fourth activity of the course');
											return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
											.then(function (response8) {
												expect(response8.body.course[0]).to.have.property('status', 1);
										    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
												.then(function(response9) {
													expect(response9.body.general).to.have.property('title', 'sesion04');
													console.log('The system returns the fifth activity of the course');
													
													lom = response9.body._id;
													return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
													.then(function (response10) {
														expect(response10.body.course[0]).to.have.property('status', 1);
												    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
														.then(function(response11) {
															expect(response11.body.general).to.have.property('title', 'sesion05');
															lom = response11.body._id;
															console.log('The system returns the sixth activity of the course');
															return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
															.then(function (response12) {
																expect(response12.body.course[0]).to.have.property('status', 1);
														    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																.then(function(response13) {
																	expect(response13.body.general).to.have.property('title', 'sesion06');
																	lom = response13.body._id;
																	console.log('The system returns the seventh activity of the course');
																	
																	return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
																	.then(function (response14) {
																		expect(response14.body.course[0]).to.have.property('status', 1);
																    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																		.then(function(response15) {
																			expect(response15.body.general).to.have.property('title', 'sesion07');
																			lom = response15.body._id;
																			console.log('The system returns the eighth activity of the course');
																			
																			return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
																			.then(function (response16) {
																				expect(response16.body.course[0]).to.have.property('status', 1);
																		    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																				.then(function(response17) {
																					expect(response17.body.general).to.have.property('title', 'sesion08');
																					lom = response17.body._id;
																					console.log('The system returns the ninth activity of the course');
																					
																					return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
																					.then(function (response18) {
																						expect(response18.body.course[0]).to.have.property('status', 1);
																				    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																						.then(function(response19) {
																							expect(response19.body.general).to.have.property('title', 'sesion09');
																							lom = response19.body._id;
																							console.log('The system returns the tenth activity of the course');
																							
																							return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
																							.then(function (response22) {
																								expect(response22.body.course[0]).to.have.property('status', 1);
																						    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																								.then(function(response23) {
																									expect(response23.body.general).to.have.property('title', 'sesion10');
																									lom = response23.body._id;
																									console.log('The system returns the eleventh activity of the course');
																									
																									return request.putBackend('/students/'+idStudent+ '/course/' + zowiCourse.name +'/lom/' + lom + '/ok', 200)
																									.then(function (response24) {
																										expect(response24.body.course[0]).to.have.property('status', 1);
																								    	return request.getBackend('/students/'+ idStudent + '/course/' + zowiCourse.name,200)
																										.then(function(response25) {
																											expect(response25.body).to.equal('Course finished');
																											console.log('The system returns: Course finished');
																											
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
							});	
						});
					});
				});
			});
		});
	});
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
});
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
	
var idStudent, idCourse, idLOM, idLoms = [], types = [], complexCourse;
	
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
		console.log('----------- complex_course ---------------');
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

 	it('Testing tu create the complex LOMS ', function(){
 		var message;
 		var loms = lom.generateComplexLOMS();
	    return request.postBackend('/loms',200,loms[0]).then(function (response) {
 	    	message = response.body;
 	    	types.push(message.split(' ')[5]);
 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
		    return request.postBackend('/loms',200,loms[1]).then(function (response) {
	 	    	message = response.body;
	 	    	types.push(message.split(' ')[5]);
	 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
			    return request.postBackend('/loms',200,loms[2]).then(function (response) {
		 	    	message = response.body;
		 	    	types.push(message.split(' ')[5]);
		 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
				    return request.postBackend('/loms',200,loms[3]).then(function (response) {
			 	    	message = response.body;
			 	    	types.push(message.split(' ')[5]);
			 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
					    return request.postBackend('/loms',200,loms[4]).then(function (response) {
				 	    	message = response.body;
				 	    	types.push(message.split(' ')[5]);
				 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
						    return request.postBackend('/loms',200,loms[5]).then(function (response) {
					 	    	message = response.body;
					 	    	types.push(message.split(' ')[5]);
					 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
							    return request.postBackend('/loms',200,loms[6]).then(function (response) {
						 	    	message = response.body;
						 	    	types.push(message.split(' ')[5]);
						 	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
								    return request.postBackend('/loms',200,loms[7]).then(function (response) {
							 	    	message = response.body;
							 	    	types.push(message.split(' ')[5]);
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
	
	it('Testing to create Complex course and enroll a student', function() {
		var message;
		complexCourse = course.generateComplexCourse(idLoms, types);
		return request.postBackend('/courses', 200, complexCourse).then(function (response) { 
			message = response.body;
	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
			
			// Testing if the course is in the database
			return request.getBackend('/courses/' + idCourse, 200).then(function(response2) {
				expect(response2.body.code).to.equal(complexCourse.code);

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
	
	it('Testing the sequential operation of the Zowi course', function() {
		var lom;
    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
		.then(function(response) {
			expect(response.body.technical).to.have.property('format', 'audio');
			console.log('The system returns the first activity (type audio) of the course ');
			lom = response.body._id;
			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
			.then(function (response) {
				expect(response.body).to.have.property('status', 1);
		    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response) {
					expect(response.body.technical).to.have.property('format', 'video');
					lom = response.body._id;
					console.log('The system returns the second activity (type video) of the course');
					
					
					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/nok', 200) 			
					.then(function (response) {																							
						expect(response.body).to.have.property('status', -1);												
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

	it('Testing to create a new student', function () {
 	    var randomStudent = student.generateRandomStudent('luis','luis@gmail.com');
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body.id_student;
	    	var answer = student.generateAnswer(['sequential', 'verbal', 'sensing', 'active']);
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

	it('Testing to enroll a student in a complex course', function() {
		var message;

		return request.putBackend('/students/'+ idStudent + '/group',200).then(function(response3) {
			expect(response3.body).to.have.property('group', 1);
			// enrolling the student in the course
			return request.putBackend('/students/'+ idStudent + '/course/' + idCourse,200)
			.then(function(response) {

				// testing if the student is already enrolled in the course
				expect(response.body).to.have.property('idCourse', idCourse);
				chakram.wait();
			});
		});
	});

	it('Testing the sequential operation of the Zowi course', function() {
		var lom;
    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
		.then(function(response) {
			expect(response.body.technical).to.have.property('format', 'document');
			console.log('The system returns the first activity (type document) of the course ');
			lom = response.body._id;
			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
			.then(function (response) {
				expect(response.body).to.have.property('status', 1);
		    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response) {
					expect(response.body.technical).to.have.property('format', 'document');
					lom = response.body._id;
					console.log('The system returns the second activity (type document) of the course');
					
					
					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/nok', 200) 			
					.then(function (response) {																							
						expect(response.body).to.have.property('status', -1);												
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
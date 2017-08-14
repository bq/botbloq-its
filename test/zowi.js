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
	
var idStudent, idCourse, idLOM, idLoms = [], zowiCourse;
	
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
		console.log('------------------ zowi ------------------');
		console.log('------------------------------------------');
 	    var randomStudent = student.generateRandomStudent('pepe','pepe@gmail.com');
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body._id;
			// data verification
	    	return request.getBackend('/students/' + idStudent, 200).then(function (response2) {
	    		expect(response2.body.learningStyle.processing).to.equal('activa');
 	    		expect(response2.body.identification.name).to.equal(randomStudent.identification.name);
 	    		chakram.wait();
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
				    chakram.wait();
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
			return request.getBackend('/courses/' + idCourse, 200).then(function(response2) {
				expect(response2.body.code).to.equal(zowiCourse.code);

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
			expect(response.body.general).to.have.property('title', 'Scratch: Zowi charla con el gato');
			console.log('The system returns the first activity of the course');
			lom = response.body._id;
			return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
			.then(function (response2) {
				expect(response2.body).to.have.property('status', 1);
		    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
				.then(function(response3) {
					expect(response3.body.general).to.have.property('title', 'Scratch: Zowi camina por la luna');
					lom = response3.body._id;
					console.log('The system returns the second activity of the course');
					
					
					return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/nok', 200) 			////// 
					.then(function (response4) {																							//////
						expect(response4.body).to.have.property('status', -1);													//////
				    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)								//////    testing
						.then(function(response5) {																							//////      nok
							expect(response5.body.general).to.have.property('title', 'Scratch: Zowi camina por la luna');											//////
							console.log('The system returns the same activity because it did not finish correctly');						//////   situation
							lom = response5.body._id;																						//////
							return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)		//////
							.then(function (response4) {																					//////
								expect(response4.body).to.have.property('status', 1);												//////
						    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)						//////
								.then(function(response5) {																					//////
									expect(response5.body.general).to.have.property('title', 'Scratch: moviendo a Zowi');									//////
									lom = response5.body._id;																				//////
									console.log('The system returns the third activity of the course');
									
									
									return request.putBackend('/students/'+idStudent+ '/course/' + idCourse +'/lom/' + lom + '/ok', 200)
									.then(function (response6) {
										expect(response6.body).to.have.property('status', 1);
								    	return request.getBackend('/students/'+ idStudent + '/course/' + idCourse,200)
										.then(function(response7) {
											expect(response7.body[0]).to.have.property('code', 'ROBOT02');
											console.log('The system send the knowledge level');
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
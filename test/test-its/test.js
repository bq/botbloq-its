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


var idStudent, idCourse, idLOM, nameCourse; 


describe('Chakram', function(){
 
	it('Testing the return all students', function () {
		return request.getBackend('/students',200);
	});
	

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



	it('Testing to create a new lom', function () {
 	    var randomLOM = lom.generateRandomLOM('Zowie charla con Gato','https://www.youtube.com/watch?v=hprno1wRpHc');
    	
	    return request.postBackend('/loms',200,randomLOM).then(function (response) {
	    	var message = response.body;
	    	idLOM = message.substring(message.lastIndexOf(' ') + 1);
	    	return request.getBackend('/loms/' + idLOM, 200)
			.then(function(response2) {
				expect(response2.body.general.title).to.equal(randomLOM.general.title);;
				chakram.wait();
			})
 	    	
 	    });
	 });

	// TODO be careful with the responses with lists. problems with asyn
	it('Testing to create a new Course' , function() {
		var randomCourse = course.generateRandomCourse();
		nameCourse = randomCourse.name;
		return request.postBackend('/courses', 200, randomCourse).then(function (response) { 
			var message = response.body;
	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
			return request.getBackend('/courses/' + randomCourse.name, 200).then(function(response2) {
				expect(response2.body[0].code).to.equal(randomCourse.code);
				var defaultSection = course.generateDefaultSection();
				defaultSection.course = nameCourse;
				return request.putBackend('/courses/create_section', 200, defaultSection).then ( function (response3) {
					var defaultLesson = course.generateDefaultLesson();
					defaultLesson.course = nameCourse;
					return request.putBackend('/courses/create_lesson', 200, defaultLesson).then(function () {
						var reqLOM = course.generateAssignedLOM();
						reqLOM.course = randomCourse.name;
						reqLOM.lom_id = idLOM;
						return request.putBackend('/courses/assign_lom', 200, reqLOM).then ( function(response4) {
							expect(response4.body[0].loms[0].lom_id).to.equal(idLOM);
							chakram.wait();
						}); 
					}); 
				});
			});
		});
	});



			
	it('Testing enroll a student in a Course' , function() {
		return request.putBackend('/students/'+ idStudent + '/course/' + nameCourse,200)
		.then(function(response) {
			// test if the student is already enrolled in the course
			expect(response.body).to.have.property('idCourse'); // return a course enrolled
			return request.getBackend('/students/' + idStudent, 200).then(function (response1) {
				expect(response1.body).to.have.property('course'); // the student has a course
 	   	    	return request.getBackend('/students/'+ idStudent + '/course/' + nameCourse,200)
				.then(function(response2) {
					expect(response2.body).to.have.property('general');
					var lom = response2.body._id;
					return request.putBackend('/students/'+idStudent+ '/course/' + nameCourse+'/lom/' + lom + '/ok', 200)
					.then(function (response3) {
						//console.log(response3.body) // testing
						chakram.wait();

					});
					
				});
			});
			
			
		});

	});
	
	
	it('Testing a student complete a Course', function(){
		var idCourse, idLoms = [], message;
		var loms = lom.generate3LOMS();
		
		// creating 3 loms
	    return request.postBackend('/loms',200,loms[0]).then(function (response) {
	    	message = response.body;
	    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
		    return request.postBackend('/loms',200,loms[1]).then(function (response) {
		    	message = response.body;
		    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
			    return request.postBackend('/loms',200,loms[2]).then(function (response) {
			    	message = response.body;			
			    	idLoms.push(message.substring(message.lastIndexOf(' ') + 1));
					console.log('Created 3 LOMS');
					
					// creating a course with 3 lessons and one lom in each lesson
					var completeCourse = course.generateCompleteCourse(idLoms);
					return request.postBackend('/courses', 200, completeCourse).then(function (response) { 
						message = response.body;
				    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
						console.log('Created a course with 3 LOMS');
						
						// Testing if the course is in the database
						return request.getBackend('/courses/' + completeCourse.name, 200).then(function(response2) {
							expect(response2.body[0].code).to.equal(completeCourse.code);
							console.log('Tested that the course is in the database');
							
							// enrolling the student in the course
							return request.putBackend('/students/'+ idStudent + '/course/' + completeCourse.name,200)
							.then(function(response3) {
								
								// testing if the student is already enrolled in the course
								expect(response3.body).to.have.property('idCourse', completeCourse.name);
								console.log('Student enrolled in the course');
								
					   	    	return request.getBackend('/students/'+ idStudent + '/course/' + completeCourse.name,200)
								.then(function(response4) {
									
									// testing if the system returns the first activity of the course
									expect(response4.body.general).to.have.property('title', 'lom0');
									var lom = response4.body._id;
									console.log('The system returns the first activity of the course');
									
									return request.putBackend('/students/'+idStudent+ '/course/' + completeCourse.name +'/lom/' + lom + '/ok', 200)
									.then(function (response5) {
										expect(response5.body.course[1]).to.have.property('status', 1);
							   	    	return request.getBackend('/students/'+ idStudent + '/course/' + completeCourse.name,200)
										.then(function(response6) {
											
											// testing if the system returns the third activity of the course
											expect(response6.body.general).to.have.property('title', 'lom2');
											lom = response6.body._id;
											console.log('The system returns the third activity of the course because the first activity completed successfully');
											
											return request.putBackend('/students/'+idStudent+ '/course/' + completeCourse.name +'/lom/' + lom + '/ok', 200)
											.then(function (response7) { 
								   	    		return request.getBackend('/students/'+ idStudent + '/course/' + completeCourse.name,200)
												.then(function(response8) {
													
													// testing if the system recognizes if el student has completed the course
													expect(response8.body).to.equal('Course finished');
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
 	// TODO test reset all
});
var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	course = new Course(),
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request(),
    // TODO from environment or from config
	host = "http://127.0.0.1:8000/botbloq/v1/its/students";

var idStudent, icCourse, idLOM; 


describe("Chakram", function(){
 
	it("Testing the return all students", function () {
		return request.getBackend('/students',200);
	});
	

	it("Testing to create a new student", function () {
 	    var randomStudent = student.generateRandomStudent();
    	// create student
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body.id_student;
	    	var answer = student.generateAnswer();
	    	// update learning style
	    	return request.postBackend("/students/" + idStudent + "/init", 200,answer ).then(function (response1) {
				// data verification
		    	return request.getBackend("/students/" + idStudent, 200).then(function (response2) {
		    		expect(response2.body.learningStyle.processing).to.equal("active");
	 	    		expect(response2.body.identification.name).to.equal(randomStudent.identification.name);
	 	    		chakram.wait();
 	    
 	    	});

	    	});
	    	
 	    });
	 });



	it("Testing to create a new lom", function () {
 	    var randomLOM = lom.generateRandomLOM();
    
	    return request.postBackend('/loms',200,randomLOM).then(function (response) {
	    	var message = response.body;
	    	idLOM = message.substring(message.lastIndexOf(" ") + 1);
	    	return request.getBackend("/loms/" + idLOM, 200)
			.then(function(response2) {
				expect(response2.body.general.title).to.equal(randomLOM.general.title);;
				chakram.wait();
			})
 	    	
 	    });
	 });

	// TODO be careful with the responses with lists. problems with asyn
	it("Testing to create a new Course" , function() {
		var randomCourse = course.generateRandomCourse();

		return request.postBackend("/courses", 200, randomCourse).then(function (response) { 
			var message = response.body;
	    	idCourse= message.substring(message.lastIndexOf(" ") + 1);
			return request.getBackend("/courses/" + randomCourse.name, 200).then(function(response2) {
				expect(response2.body[0].code).to.equal(randomCourse.code);
				chakram.wait();
			});
		});
	});

	it("Testing create Section ", function() {
		var randomCourse = course.generateRandomCourse();
		var defaultSection = course.generateDefaultSection();
		defaultSection.course = randomCourse.name; 
		return request.putBackend("/courses/create_section", 200, defaultSection).then ( function (response3) {
			chakram.wait();
		});

	});

	it("Testing create Lesson ", function() {
		var randomCourse = course.generateRandomCourse();
		var defaultLesson = course.generateDefaultLesson();
		defaultLesson.course = randomCourse.name; 
		
		return request.putBackend("/courses/create_lesson", 200, defaultLesson).then(function () {
				var reqLOM = course.generateAssignedLOM();
				reqLOM.course = randomCourse.name;
				reqLOM.lom_id = idLOM;
				return request.putBackend("/courses/create_lom", 200, reqLOM).then ( function(response4) {
					expect(response4.body[0].loms[0].lom_id).to.equal(idLOM);
					chakram.wait();
				}); 

				
			}); 

	});



			
	it("Testing enroll a student in a Course" , function() {
		return request.putBackend('/students/'+ idStudent + "/course/" + idCourse,200)
		.then(function(response) {
			//console.log(response.body); // undefined is error
			return request.getBackend('/students/'+ idStudent + "/course/" + idCourse,200)
			.then(function(response2) {
				console.log(response2.body);
				expect(response2.body).to.have.property("general");
				chakram.wait();
			});
			
		});

	});
 
 	// TODO test reset all
});
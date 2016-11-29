var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	course = new Course(),
    Request = require('./request.js'),
    request = new Request(),
	host = "http://127.0.0.1:8000/botbloq/v1/its/students";




describe("Chakram", function(){
 
	it("Testing the return all students", function () {
		return request.getBackend('/students',200);
	});
	

	it("Testing to create a new student", function () {
 	    var randomStudent = student.generateRandomStudent();
    
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	return request.getBackend("/students/" + response.body.id_student, 200).then(function (response2) {
 	    		expect(response2.body.identification.name).to.equal(randomStudent.identification.name);
 	    		chakram.wait();
 	    
 	    	});
 	    });
	 });


	it("Testing to create a new Course" , function() {
		var randomCourse = course.generateRandomCourse();

		return request.postBackend("/courses", 200, randomCourse)
		.then(function (response) { 
			return request.getBackend("/courses/" + randomCourse.name, 200)
			.then(function(response2) {
				expect(response2.body[0].code).to.equal(randomCourse.code);
			}).then ( function () {
				var defaultSection = course.generateDefaultSection();
				defaultSection.course = randomCourse.name; 
				request.postBackend("/courses/create_section", 200, defaultSection);
			}).then ( function () {
				var defaultLesson = course.generateDefaultLesson();
				defaultLesson.course = randomCourse.name; 
				request.postBackend("/courses/create_lesson", 200, defaultLesson);
				chakram.wait();
			} ); 
		});
	});
 
});
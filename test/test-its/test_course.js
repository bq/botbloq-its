var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	mongo = require('mongodb'),
	course = new Course(),
	courseModel = require('../../app/api/courses/courses.model.js');
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request();


var idCourse, err, idLOM, nameCourse; 

describe('Chakram', function(){

	it('Testing the return all courses', function () {
		console.log('------------------------------------------');
		console.log('-------------- test_course ---------------');
		console.log('------------------------------------------');
		
		return request.getBackend('/courses',200);
	});

	it('Testing to create a new course and testing errors', function () {
 	    var randomCourse = course.generateRandomCourse2('COURSE_1', 'TEST_1');
	    return request.postBackend('/courses',200,randomCourse).then(function (response) {
 			var message = response.body;
 	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
 	    	nameCourse= 'COURSE_1';
	    	console.log('creating a new course');
			randomCourse = course.generateRandomCourse2(undefined, 'TEST_2');
		    return request.postBackend('/courses', 400, randomCourse).then(function (response) {
				console.log('creating a course without name');
				randomCourse = course.generateRandomCourse2('COURSE_1', 'TEST_1');
			    return request.postBackend('/courses', 403, randomCourse).then(function (response) {
					console.log('creating a course with a repeat name');
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to get a course and testing errors', function(){
	    return request.getBackend('/courses/'+nameCourse,200).then(function (response) {		
			expect(response.body[0].name).to.equal(nameCourse);	
	    	console.log('getting a course');
			var id = mongo.ObjectID;
		    return request.getBackend('/courses/' + id, 404).then(function (response) {		
				console.log('getting a not registrated course');
				chakram.wait();
			});
		});
	});
	
	it('Testing to update a course and testing errors', function(){
		var updatedCourse = course.generateRandomCourse2('Updated_Course_1', 'Updated_code_course');
		var id = mongo.ObjectID;
		return request.putBackend('/courses/' + id, 404, updatedCourse).then(function (response) {		
			console.log('updating a not registrated course');	
			var badCourse = course.generateRandomCourse2('COURSE_2', 'TEST_2');
		    return request.postBackend('/courses/', 200, badCourse).then(function (response) {	
			    var badName = 'COURSE_2';
	 			var message = response.body;
	 	    	var badId = message.substring(message.lastIndexOf(' ') + 1);
				badCourse = course.generateRandomCourse2('COURSE_1', 'TEST_2');
				return request.putBackend('/courses/' + badId, 400, badCourse).then(function (response) {	
					expect(response.body).to.equal('A course with the same name already exists');	
					console.log('updating a course with a repeat name');	
				    return request.putBackend('/courses/' + idCourse, 200, updatedCourse).then(function (response) {	
						expect(response.body.name).to.equal('Updated_Course_1');		
						console.log('updating a course');
						chakram.wait();
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
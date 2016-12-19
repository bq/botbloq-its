var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Course = require('./course.js'),
	mongo = require('mongodb'),
	course = new Course(),
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request();


var idStudent, err, idLOM, nameCourse; 


describe('Chakram', function(){
 
	it('Testing the return all students', function () {
		return request.getBackend('/students',200);
	});
	
	it('Testing to create a new student and testing errors', function () {
 	    var randomStudent = student.generateRandomStudent('pepe','pepe@gmail.com');
	    return request.postBackend('/students',200,randomStudent).then(function (response) {
	    	idStudent = response.body.id_student;
	    	console.log('creating a new student');
			
			randomStudent = student.generateRandomStudent('jose',undefined);
		    return request.postBackend('/students', 400, randomStudent).then(function (response) {
				expect(response.body).to.equal('Student email is required');
				console.log('creating a student without email');
				
				randomStudent = student.generateRandomStudent('jose','pepe@gmail.com');
			    return request.postBackend('/students', 403, randomStudent).then(function (response) {
					expect(response.body).to.equal('A student with the same email already exists');
					console.log('creating a student with a repeat email');
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to deactivate and activate a student', function(){
	    return request.lockBackend('/students/'+idStudent,200).then(function (response) {		
			expect(response.body.active).to.equal(0);	
	    	console.log('deactivating a student');
			
		    return request.unlockBackend('/students/'+idStudent,200).then(function (response) {		
				expect(response.body.active).to.equal(1);	
		    	console.log('activating a student');
				chakram.wait();
			});
		});
	});
	
	it('Testing to get a student and testing errors', function(){
	    return request.getBackend('/students/'+idStudent,200).then(function (response) {		
			expect(response.body.identification.name).to.equal('pepe');	
	    	console.log('getting a student');
		    return request.lockBackend('/students/'+idStudent,200).then(function (response) {		
				expect(response.body.active).to.equal(0);
			    return request.getBackend('/students/'+idStudent,403).then(function (response) {		
					expect(response.body).to.equal('The student with id: ' + idStudent + ' is not activated');	
					console.log('getting a deactivated student');
					var id = mongo.ObjectID;
				    return request.getBackend('/students/' + id, 404).then(function (response) {		
						console.log('getting a not registrated student');
					    return request.unlockBackend('/students/'+idStudent,200).then(function (response) {		
							expect(response.body.active).to.equal(1);
							chakram.wait();
						});
					});
				});
			});
		});
	});
	
	it('Testing to update a student and testing errors', function(){
		var updatedStudent = student.generateCompleteStudent();
	    return request.lockBackend('/students/'+idStudent,200).then(function (response) {		
			expect(response.body.active).to.equal(0);
			return request.putBackend('/students/'+idStudent,403, updatedStudent).then(function (response) {		
				expect(response.body).to.equal('The student with id: ' + idStudent + ' is not activated');	
				console.log('updating a deactivated student');
				
			    return request.unlockBackend('/students/' + idStudent,200).then(function (response) {		
					expect(response.body.active).to.equal(1);
					var id = mongo.ObjectID;
					return request.putBackend('/students/' + id, 404, updatedStudent).then(function (response) {		
						console.log('updating a not registrated student');
				
						var badStudent = student.generateRandomStudent('Luis', 'luis@gmail.com');
					    return request.postBackend('/students/', 200, badStudent).then(function (response) {	
						    var badId = response.body.id_student;
							badStudent = student.generateRandomStudent('Luis', 'pepe@gmail.com');
							return request.putBackend('/students/' + badId, 400, badStudent).then(function (response) {	
								expect(response.body).to.equal('A student with the same email already exists');	
								console.log('updating a student with a repeat email');
								
							    return request.putBackend('/students/' + idStudent, 200, updatedStudent).then(function (response) {	
									expect(response.body.identification.name).to.equal('antonio');		
									console.log('updating a student');
									chakram.wait();
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

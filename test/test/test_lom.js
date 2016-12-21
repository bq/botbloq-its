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


var err, idLOM, nameCourse; 


describe('Chakram', function(){
 
	it('Testing the return all loms', function () {
		return request.getBackend('/loms',200);
	});
	
	it('Testing to create a new LOM', function () {
 	    var randomLOM = lom.generateRandomLOM('LOM test');
	    return request.postBackend('/loms',200,randomLOM).then(function (response) {
			var message = response.body;
	    	idLOM = message.substring(message.lastIndexOf(' ') + 1);
	    	console.log('creating a new LOM');
			chakram.wait();
		});
	});
	
	it('Testing to get a LOM', function(){
	    return request.getBackend('/loms/'+idLOM,200).then(function (response) {		
			expect(response.body.general.title).to.equal('LOM test');	
	    	console.log('getting a LOM');
			var id = mongo.ObjectID;
		    return request.getBackend('/loms/' + id, 404).then(function (response) {		
				console.log('getting a not registrated LOM');
				chakram.wait();
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
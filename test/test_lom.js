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


var err, idLOM, nameCourse, id = 'error'; 


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
 
	it('Testing the return all loms', function () {
		console.log('------------------------------------------');
		console.log('--------------- test_lom -----------------');
		console.log('------------------------------------------');
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
			
		    return request.getBackend('/loms/' + id, 404).then(function (response) {	
				expect(response.body).to.equal('The lom with id: ' + id + ' is not registrated');	
				console.log('getting a not registrated LOM');
				
				chakram.wait();
			});
		});
	});
	
	it('Testing to update a LOM', function(){
 	    var randomLOM = lom.generateRandomLOM('LOM test updated', 'video');
		return request.putBackend('/loms/' + id, 404, randomLOM).then(function (response) {	
			expect(response.body).to.equal('The lom with id: ' + id + ' is not registrated');	
			console.log('updating a not registrated LOM');
			
		    return request.putBackend('/loms/' + idLOM, 200, randomLOM).then(function (response) {		
				expect(response.body.general.title).to.equal('LOM test updated');	
		    	console.log('updating a LOM');
				
				chakram.wait();
			});
		});
	});
	
	it('Testing to remove a LOM', function(){
		return request.deleteBackend('/loms/' + id, 404).then(function (response) {	
			expect(response.body).to.equal('The lom with id: ' + id + ' is not registrated');	
			console.log('removing a not registrated LOM');
			
		    return request.deleteBackend('/loms/' + idLOM, 200).then(function (response) {		
				expect(response.body.ok).to.equal(1);	
		    	console.log('removing a LOM');
				
				chakram.wait();
			});
		});
	});

});

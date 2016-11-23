var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
    Request = require('./request.js'),
    request = new Request(),
	host = "localhost:8000/botbloq/v1/its/students";




describe("Chakram", function(){
 
	it("Testing the return all students", function () {
 
		return chakram.get(host);
 
	});
	
	it("Testing to create a new student", function () {
 	    var randomStudent = student.generateRandomStudent();
		return request.postBackend('/students',200,randomStudent).then(function() {
            return request.headBackend('/students/'+randomStudent._id,200).then(function(response) {
                expect(response).to.equal("[" + JSON.stringify(randomStudent) + "]");
                return chakram.wait();
            });
        });
	});
 
});
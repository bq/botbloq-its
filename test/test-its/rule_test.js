var chakram = require('chakram'),
	expect = chakram.expect,
	Student = require('./student.js'),
	student = new Student(),
	LOM = require('./lom.js'),
	lom = new LOM(),
    Request = require('./request.js'),
    request = new Request();

    var student_rule;

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

	it('Testing to assign a student to a group', function () {
		console.log('------------------------------------------');
		console.log('--------------- rule_test ----------------');
		console.log('------------------------------------------');
		console.log('-----    ONLY WORKS WITH 5 GROUPS   ------');		

		student_rule = student.generateRuleStudent(12 , 0 , 4 , 0 , 0, 0 , 2.20 );
		return request.postBackend('/loms/rules/rules',200, student_rule).then(function (response) {
			expect(response.body).to.equal("Grupo 1");
			console.log('Assigning a student to a group 1');

			student_rule = student.generateRuleStudent(12 , 4 , 4 ,76 , 0, 0 , 10 );
			return request.postBackend('/loms/rules/rules',200, student_rule).then(function (response) {
				expect(response.body).to.equal("Grupo 2");
				console.log('Assigning a student to a group 2');

				student_rule = student.generateRuleStudent(12 , 18 , 4 ,76 , 64, 0 , 10 );
				return request.postBackend('/loms/rules/rules',200, student_rule).then(function (response) {
					expect(response.body).to.equal("Grupo 3");
					console.log('Assigning a student to a group 3');

					student_rule = student.generateRuleStudent(12 , 4 , 4 ,76 , 64, 0 , 12 );
					return request.postBackend('/loms/rules/rules',200, student_rule).then(function (response) {
						expect(response.body).to.equal("Grupo 4");
						console.log('Assigning a student to a group 4');

						student_rule = student.generateRuleStudent(12 , 4 , 4 ,76 , 8000, 0 , 12 );
						return request.postBackend('/loms/rules/rules',200, student_rule).then(function (response) {
							expect(response.body).to.equal("Grupo 5");
							console.log('Assigning a student to a group 5');

							chakram.wait();
						});
					});
				});
			});
		});
	});
});
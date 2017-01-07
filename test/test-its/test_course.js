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


var idCourse, idLOM, err, nameCourse, badId, section, lesson, lom, id = 'error', lom_assign; 

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

	it('Testing the return all courses', function () {
		console.log('------------------------------------------');
		console.log('-------------- test_course ---------------');
		console.log('------------------------------------------');
		
		return request.getBackend('/courses',200);
	});

	it('Testing to create a new course and testing errors', function () {
		console.log('-------------- courses testing ---------------');
 	    var randomCourse = course.generateRandomCourse2('COURSE_1', 'TEST_1');
	    return request.postBackend('/courses',200,randomCourse).then(function (response) {
 			var message = response.body;
 	    	idCourse= message.substring(message.lastIndexOf(' ') + 1);
			expect(response.body).to.equal('Added the course with id: ' + idCourse);
	    	console.log('creating a new course');
			
 	    	nameCourse= 'COURSE_1';
			randomCourse = course.generateRandomCourse2(undefined, 'TEST_2');
		    return request.postBackend('/courses', 400, randomCourse).then(function (response) {
				expect(response.body).to.equal('Course name is required');
				console.log('creating a course without name');
				
				randomCourse = course.generateRandomCourse2('COURSE_1', 'TEST_1');
			    return request.postBackend('/courses', 403, randomCourse).then(function (response) {
					expect(response.body).to.equal('A course with the same name already exists');
					console.log('creating a course with a repeat name');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to get a course and testing errors', function(){
	    return request.getBackend('/courses/'+nameCourse,200).then(function (response) {		
			expect(response.body.name).to.equal(nameCourse);	
	    	console.log('getting a course');
			
		    return request.getBackend('/courses/' + id, 404).then(function (response) {	
				expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');		
				console.log('getting a not registrated course');
				
				chakram.wait();
			});
		});
	});
	
	it('Testing to update a course and testing errors', function(){
		var updatedCourse = course.generateRandomCourse2('Updated_Course_1', 'Updated_code_course');
		return request.putBackend('/courses/' + mongo.ObjectID, 404, updatedCourse).then(function (response) {		
			console.log('updating a not registrated course');
				
			var badCourse = course.generateRandomCourse2('COURSE_2', 'TEST_2');
		    return request.postBackend('/courses/', 200, badCourse).then(function (response) {	
	 			var message = response.body;
	 	    	badId = message.substring(message.lastIndexOf(' ') + 1);
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
	
	it('Testing to update a field in a course and testing errors', function(){
		var newField ={name: id, field: 'name', value: 'Updated_Course_2'};
		return request.putBackend('/courses/update_field', 404, newField).then(function (response) {	
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');	
			console.log('updating a field of a not registrated course');	
			
			newField ={name: 'COURSE_2', field: 'name', value: 'Updated_Course_1'};
		    return request.putBackend('/courses/update_field', 400, newField).then(function (response) {
				expect(response.body).to.equal('The new name already exist in other course');		
				console.log('updating a course field with a repeat name');
				
				newField ={name: 'Updated_Course_1', field: 'name', value: 'Updated_Course_field_1'};
				nameCourse='Updated_Course_field_1';
				return request.putBackend('/courses/update_field', 200, newField).then(function (response) {	
					expect(response.body).to.equal('Updated the course with id: ' + newField.name);
					console.log('updating a course');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to remove a course and testing errors', function(){
	    return request.deleteBackend('/courses/'+mongo.ObjectID,404).then(function (response) {	
	    	console.log('removing a not registrated course');
			
		    return request.deleteBackend('/courses/' + badId, 200).then(function (response) {	
				expect(response.body.ok).to.equal(1);	
		    	console.log('removing a course');
				
				chakram.wait();
			});
		});
	});
	
	it('Testing to get all sections of a course and testing errors', function () {
		console.log('-------------- sections testing ---------------');
	    return request.getBackend('/courses/'+id+'/sections',404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('getting all sections of a not registrated course');
			
		    return request.getBackend('/courses/'+nameCourse+'/sections',200).then(function (response) {
				expect(response.body).to.be.empty;
				console.log('getting all sections of a course');
				
				chakram.wait();
			});
		});
	});
	
	it('Testing to create a section in a course and testing errors', function () {
		section = course.generateDefaultSection();
		section.course = id;
	    return request.putBackend('/courses/create_section',404, section).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('creating a sections in a not registrated course');
			
			section.course = nameCourse;
		    return request.putBackend('/courses/create_section',200, section).then(function (response) {
				expect(response.body.name).to.equal(section.section.name);
				console.log('creating a section in a course');
				
			    return request.putBackend('/courses/create_section',400, section).then(function (response) {
					expect(response.body).to.equal('Error section already exist');
					console.log('creating a repeat section in a course');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to get a section of a course and testing errors', function () {
	    return request.getBackend('/courses/'+id+'/section/'+id,404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('getting a section of a not registrated course');
			
		    return request.getBackend('/courses/'+nameCourse+'/section/error',404).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('getting a not registrated section of a course');
				
			    return request.getBackend('/courses/'+nameCourse+'/section/'+section.section.name,200).then(function (response) {
					expect(response.body.name).to.equal(section.section.name);
					console.log('getting a section of a course');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to update a section of a course and testing errors', function () {
		section = course.generateDefaultSection();
		section.course = id;
	    return request.putBackend('/courses/update_section',404, section).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('updating a section of a not registrated course');
			
			section.course = nameCourse;
			section.section.name = id;
		    return request.putBackend('/courses/update_section',404, section).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('updating a not registrated section of a course');
				
				section.section.name = 'Section_1_1';
				section.section.summary = 'Updated_Resume'
			    return request.putBackend('/courses/update_section',200, section).then(function (response) {
					expect(response.body.summary).to.equal(section.section.summary);
					console.log('updating a section of a course');
					
					chakram.wait();
				});
			});
		});
	});

	it('Testing to update a field of a section of a course and testing errors', function () {
		section = {course: id, section: section.section.name, field: 'summary', value: 'New_Summary'};
	    return request.putBackend('/courses/update_section_field',404, section).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('updating a field of a section of a not registrated course');
			
			section.course = nameCourse;
			section.section = id;
		    return request.putBackend('/courses/update_section_field',404, section).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('updating a field of a not registrated section of a course');
				
				section.section = 'Section_1_1';
			    return request.putBackend('/courses/update_section_field',200, section).then(function (response) {
					expect(response.body.summary).to.equal(section.value);
					console.log('updating a field of a section of a course');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to delete a section of a course and testing errors', function () {
	    return request.deleteBackend('/courses/' + id + '/section/'+ id,404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('deleting a section of a not registrated course');
			
		    return request.deleteBackend('/courses/'+nameCourse+'/section/'+id,404, section).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('deleting a not registrated section of a course');
				
				section.section = 'Section_1_1';
			    return request.deleteBackend('/courses/'+nameCourse+'/section/'+section.section,200).then(function (response) {
					expect(response.body.ok).to.equal(1);
					console.log('deleting a field of a section of a course');
					
					chakram.wait();
				});
			});
		});
	});
	
	it('Testing to get all lessons of a section and a course and testing errors', function () {
		console.log('-------------- lessons testing ---------------');
		section = course.generateDefaultSection();
		section.course = nameCourse;
	    return request.putBackend('/courses/create_section',200, section).then(function (response) {
		    return request.getBackend('/courses/'+id+'/section/'+id+'/lessons',404).then(function (response) {
				expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
				console.log('getting all lessons of a section of a not registrated course');
				
			    return request.getBackend('/courses/'+nameCourse+'/section/'+id+'/lessons',404).then(function (response) {
					expect(response.body).to.equal('The section with id : ' + id + 
					' has not been found un the course with id: ' + nameCourse);
					console.log('getting all lessons of a not registrated section of a course');
					
				    return request.getBackend('/courses/'+nameCourse+'/section/'+section.section.name+'/lessons',200).then(function (response) {
						expect(response.body).to.be.empty;
						console.log('getting all lessons of a section of a course');
						
						chakram.wait();
					});
				});
			});
		});
	});
	
	it('Testing to create a lesson in a section and a course and testing errors', function () {
		lesson = course.generateDefaultLesson();
		lesson.course = id;
	    return request.putBackend('/courses/create_lesson',404, lesson).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('creating a lesson in a section of a not registrated course');
			
			lesson.course = nameCourse;
			lesson.section = id;
		    return request.putBackend('/courses/create_lesson',404, lesson).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('creating a lesson in a not registrated section of a course');
				
				lesson.section = 'Section_1_1';
			    return request.putBackend('/courses/create_lesson',200, lesson).then(function (response) {
					expect(response.body.name).to.equal(lesson.lesson.name);
					console.log('creating a lesson in a section of a course');
					
				    return request.putBackend('/courses/create_lesson',400, lesson).then(function (response) {
						expect(response.body).to.equal('Error lesson already exist');
						console.log('creating a lesson with a repeat name in a section of a course');
						
						chakram.wait();
					});
				});
			});
		});
	});
	
	it('Testing to get a lesson of a section and a course and testing errors', function () {
	    return request.getBackend('/courses/'+id+'/section/'+id+'/lesson/'+id,404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('getting a lesson of a section of a not registrated course');
			
		    return request.getBackend('/courses/'+nameCourse+'/section/'+id+'/lesson/'+id,404).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('getting a lesson of a not registrated section of a course');
				
			    return request.getBackend('/courses/'+nameCourse+'/section/'+section.section.name+'/lesson/'+id,404).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + id + 
					' has not been found un the section with id: ' + section.section.name);
					console.log('getting a not registrated lesson of a section of a course');
					
				    return request.getBackend('/courses/'+nameCourse+'/section/'+section.section.name+'/lesson/'+lesson.lesson.name,200).then(function (response) {
						expect(response.body.name).to.equal(lesson.lesson.name);
						console.log('getting a lesson of a section of a course');
						
						chakram.wait();
					});
				});
			});
		});
	});
	
	it('Testing to update a lesson of a section and a course and testing errors', function () {
		lesson = course.generateDefaultLesson();
		lesson.course = 'error';
	    return request.putBackend('/courses/update_lesson',404, lesson).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + lesson.course + ' is not registrated');
			console.log('updating a lesson of a section of a not registrated course');
			
			lesson.course = nameCourse;
			lesson.section = 'error';
		    return request.putBackend('/courses/update_lesson',404, lesson).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + lesson.section + 
				' has not been found un the course with id: ' + lesson.course);
				console.log('updating a lesson of a not registrated section of a course');
				
				lesson.section = section.section.name;
				lesson.lesson.name = 'Error';
			    return request.putBackend('/courses/update_lesson',404, lesson).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + lesson.lesson.name + 
					' has not been found un the section with id: ' + lesson.section);
					console.log('updating a not registrated lesson of a section and a course');
					
					lesson.lesson.name = 'Lesson_1_1';
					lesson.lesson.summary = 'Updated_Summary'
				    return request.putBackend('/courses/update_lesson',200, lesson).then(function (response) {
						expect(response.body.summary).to.equal(lesson.lesson.summary);
						console.log('updating a lesson of a section and a course');
						
						chakram.wait();
					});
				});
			});
		});
	});
	
	it('Testing to update a field of a lesson of a section and a course and testing errors', function () {
		lesson = {course: id, section: id, lesson: id, field: 'summary', value: 'New_Summary'};
	    return request.putBackend('/courses/update_lesson_field',404, lesson).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + lesson.course + ' is not registrated');
			console.log('updating a field of a lesson of a section and a not registrated course');
			
			lesson.course = nameCourse;
		    return request.putBackend('/courses/update_lesson_field',404, lesson).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + lesson.section + 
				' has not been found un the course with id: ' + lesson.course);
				console.log('updating a field of a lesson of a not registrated section and a course');
				
				lesson.section = section.section.name;
			    return request.putBackend('/courses/update_lesson_field',404, lesson).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + lesson.lesson + 
					' has not been found un the section with id: ' + lesson.section);
					console.log('updating a field of a not registrated lesson of a section and a course');
					
					lesson.lesson = 'Lesson_1_1'
				    return request.putBackend('/courses/update_lesson_field',200, lesson).then(function (response) {
						expect(response.body.summary).to.equal(lesson.value);
						console.log('updating a field of a section of a course');
						
						chakram.wait();
					});
				});
			});
		});
	});
	
	it('Testing to delete a lesson of a section and a course and testing errors', function () {
	    return request.deleteBackend('/courses/' + id + '/section/' + id + '/lesson/' + id,404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('deleting a lesson of a section and a not registrated course');
			
		    return request.deleteBackend('/courses/' + lesson.course + '/section/' + id + '/lesson/' + id,404).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + lesson.course);
				console.log('deleting a not registrated section of a course');
				
			    return request.deleteBackend('/courses/' + lesson.course + '/section/' + lesson.section + '/lesson/' + id,404).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + id + 
					' has not been found un the section with id: ' + lesson.section);
					console.log('deleting a not registrated lesson of a section and a course');
					
				    return request.deleteBackend('/courses/' + lesson.course + '/section/' + lesson.section + '/lesson/' + lesson.lesson,200).then(function (response) {
						expect(response.body.ok).to.equal(1);
						console.log('deleting a lesson of a section and a course');
						
						lesson = course.generateDefaultLesson();
						lesson.course = nameCourse;
					    return request.putBackend('/courses/create_lesson',200, lesson).then(function (response) {
							chakram.wait();
						});
					});
				});
			});
		});
	});
	
	it('Testing to get all loms of a lesson and a section and a course and testing errors', function () {
		console.log('-------------- loms testing ---------------');
		return request.getBackend('/courses/' + id + '/section/' + id +
		'/lesson/' + id + '/loms',404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('getting all loms of a lesson of a section and a not registrated course');
			
			return request.getBackend('/courses/' + nameCourse + '/section/' + id +
			'/lesson/' + id + '/loms',404).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + nameCourse);
				console.log('getting all loms of a lesson of a not registrated section and a course');
				
				return request.getBackend('/courses/' + nameCourse + '/section/' + section.section.name +
				'/lesson/' + id + '/loms',404).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + id + 
					' has not been found un the section with id: ' + section.section.name);
					console.log('getting all loms of a not registrated lesson of a section and a course');
					
					return request.getBackend('/courses/' + nameCourse + '/section/' + section.section.name +
					'/lesson/' + lesson.lesson.name + '/loms',200).then(function (response) {
						expect(response.body).to.be.empty;
						chakram.wait();
					});		
				});
			});
		});
	});
	
	it('Testing to assign a lom in a lesson and a section and a course and testing errors', function () {
		lom = lom.generateRandomLOM('Example_LOM','');
	    return request.postBackend('/loms',200,lom).then(function (response) {
			var message = response.body;
	    	idLOM = message.substring(message.lastIndexOf(' ') + 1);
			console.log('creating a lom');
			
			lom_assign = {course: id, section: id, lesson: id, lom_id: id};
			return request.putBackend('/courses/assign_lom',404, lom_assign).then(function (response) {
				expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
				console.log('assigning a lom in a lesson of a section and a not registrated course');
				
				lom_assign.course = nameCourse;
				return request.putBackend('/courses/assign_lom',404, lom_assign).then(function (response) {
					expect(response.body).to.equal('The section with id : ' + id + 
					' has not been found un the course with id: ' + lom_assign.course);
					console.log('assigning a lom in a lesson of a not registrated section and a course');
					
					lom_assign.section = section.section.name;
					return request.putBackend('/courses/assign_lom',404, lom_assign).then(function (response) {
						expect(response.body).to.equal('The lesson with id : ' + id + 
						' has not been found un the section with id: ' + lom_assign.section);
						console.log('assigning a lom in a not registrated lesson of a section and a course');
						
						lom_assign.lesson = lesson.lesson.name;
						return request.putBackend('/courses/assign_lom',404, lom_assign).then(function (response) {
							expect(response.body).to.equal('The lom with id: ' + id + ' is not registrated');
							console.log('assigning a not registrated lom in a lesson of a section and a course');
							
							lom_assign.lom_id = idLOM;
							return request.putBackend('/courses/assign_lom',200, lom_assign).then(function (response) {
								expect(response.body.lom_id).to.equal(lom_assign.lom_id);
								console.log('assigning a lom in a lesson of a section and a course');
								chakram.wait();
							});
						});
					});
				});
			});
		});
	});
	
	it('Testing to get a lom of a lesson and a section and a course and testing errors', function () {
		return request.getBackend('/courses/' + id + '/section/' + id +
		'/lesson/' + id + '/lom/'+ id ,404).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('getting a lom of a lesson of a section and a not registrated course');
			
			return request.getBackend('/courses/' + lom_assign.course + '/section/' + id +
			'/lesson/' + id + '/lom/' + id,404).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found in the course with id: ' + lom_assign.course);
				console.log('getting a lom of a lesson of a not registrated section and a course');
				
				return request.getBackend('/courses/' + lom_assign.course + '/section/' + lom_assign.section +
				'/lesson/' + id + '/lom/'+ id,404).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + id + 
					' has not been found in the section with id: ' + lom_assign.section);
					console.log('getting a lom of a not registrated lesson of a section and a course');
					
					return request.getBackend('/courses/' + lom_assign.course + '/section/' + lom_assign.section +
					'/lesson/' + lom_assign.lesson + '/lom/' + id,404).then(function (response) {
						expect(response.body).to.equal('The lom with id : ' + id +
						' has not been found in the lesson with id: ' + lom_assign.lesson);
						console.log('getting a not registrated lom of a lesson of a section and a course');
						
						return request.getBackend('/courses/' + lom_assign.course + '/section/' + lom_assign.section +
						'/lesson/' + lom_assign.lesson + '/lom/' + lom_assign.lom_id,200).then(function (response) {
							expect(response.body.lom_id).to.equal(lom_assign.lom_id);
							console.log('getting a lom of a lesson of a section and a course');
							
							chakram.wait();
						});
					});		
				});
			});
		});
	});
	
	it('Testing to remove a lom in a lesson and a section and a course and testing errors', function () {			
		lom_assign = {course: id, section: id, lesson: id, lom_id: id};
		return request.deleteBackend('/courses/delete_lom',404, lom_assign).then(function (response) {
			expect(response.body).to.equal('The course with id: ' + id + ' is not registrated');
			console.log('removing a lom in a lesson of a section and a not registrated course');
			
			lom_assign.course = nameCourse;
			return request.deleteBackend('/courses/delete_lom',404, lom_assign).then(function (response) {
				expect(response.body).to.equal('The section with id : ' + id + 
				' has not been found un the course with id: ' + lom_assign.course);
				console.log('removing a lom in a lesson of a not registrated section and a course');
				
				lom_assign.section = section.section.name;
				return request.deleteBackend('/courses/delete_lom',404, lom_assign).then(function (response) {
					expect(response.body).to.equal('The lesson with id : ' + id + 
					' has not been found un the section with id: ' + lom_assign.section);
					console.log('removing a lom in a not registrated lesson of a section and a course');
					
					lom_assign.lesson = lesson.lesson.name;
					return request.deleteBackend('/courses/delete_lom',404, lom_assign).then(function (response) {
						expect(response.body).to.equal('The lom with id : ' + id +
						' has not been found un the lesson with id: ' + lom_assign.lesson);
						console.log('removing a not registrated lom in a lesson of a section and a course');
						
						lom_assign.lom_id = idLOM;
						return request.deleteBackend('/courses/delete_lom',200, lom_assign).then(function (response) {
							expect(response.body.ok).to.equal(1);
							console.log('removing a lom in a lesson of a section and a course');
							
							chakram.wait();
						});
					});
				});
			});
		});
	});
	
});
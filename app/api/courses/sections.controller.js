'use strict';

/*

*/

var Courses = require('./courses.model.js'),
	Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
	
// Exporting create function
// It receives as parameters the Id of the course where the section 
// should be created and the section Id to be created and
// the information about the section as the body of the
// request in JSON format
// Example: localhost:8000/botbloq/v1/its/courses/course/Course2/section/Section2.1
// JSON: { "resume": "section resume","lessons":{}}
// Up to the moment, it has not be possible to insert the new property
// and value in the course
exports.create = function (req, res) 
	{
	console.log('params',req.params);
	var courseId = req.params.course
	console.log('courseId ',courseId);	
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(500).send(err);} 
		else if (course) { 
				var sectionId = req.params.section
				console.log('sectionId ',sectionId);
				console.log('section body',req.body);
				console.log('course obj',course);
				var aux = course;
				if ('sections' in course) {console.log('esta --> agregarla');
				// hay que averiguar si la section no existía ya
				// y falta agregarla
				}
				else {console.log('no esta --> crear el campo con esa section');
					var field = "sections"
					course[field] = { sectionId : req.body }; // {"prueba":333};esto tampoco funciona
					console.log('course updated',course);
					course.save(function (err) {
						if(err) {
							console.error('ERROR!');
							res.send('error while updating');
						};
					});
				}
				res.end('Section ' + sectionId + ' created in ' + courseId);
				// res.status(200).json(course); 
				} 
			 else { res.sendStatus(404);}    
		}
	);    
};

	
// Exporting create function
// insert the section received as parameter
// exports.create = function(req, res) {
	// console.log('params',req.params);
	// var p1 = req.params.courses
	// var p2 = req.params.sections
	// console.log('courses',p1);
	// console.log('sections',p1);
    // res.end('params: ' + p1 + ' ' + p2);

	// // console.log('section body',req.body);
    // // Sections.create(req.body, 
		// // function (err, section) {
			// // if (err) res.sendStatus(err.code);
			// // console.log('section created!');
			// // var id = section._id;
			// // res.writeHead(200, {'Content-Type': 'text/plain'});
			// // res.end('Added the section with id: ' + id);
		// // }
	// // );
// };
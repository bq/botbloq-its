'use strict';

/*
This version works with the following exported functions.
function all: list all sections from a course
function get_section: list the indicated section from a course

*/

var Courses = require('./courses.model.js'),
	Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
var controller = require('./courses.controller.js');
	
// Exporting function all
// list all sections from a course
exports.all_sections = function (req, res) 
	{	
	var courseId = req.params.course_id;
	console.log("course_id",courseId);
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(500).send(err);} 
		else if (course) 
			{ 
			console.log("course",course);
			// console.log("course.sections",course["sections"]); //course.sections);
			res.send(course.sections);
			// res.status(200).json(course.sections); 
			} 
			 else { res.sendStatus(404);}    
	});
};

// Exporting function get_section
// list the indicated section from a course
// If the section does not exists, prints a message
exports.get_section = function (req, res) 
	{		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	console.log("course",courseId);
	console.log("section",sectionId);
	
	Courses.findOne({"name" : courseId}, function(err, course) 
		{
        if (err) { res.status(500).send(err);} 
		else if (course) 
			{ 
			console.log("course",course);
			var sections = course["sections"];
			console.log("sections",sections);
			var len = sections.length;
			for (var i = 0; i < len; i++) {
					console.log("elem",sections[i]);
					var elem = sections[i];
					if (elem.name == sectionId)
						{
						res.send("course: "+courseId+"\nsection:\n"+JSON.stringify(elem));
						};
			}			
			res.send("course: "+courseId+" section: "+sectionId+" not found");			
			} 
			else { res.sendStatus(404);}    
	});	
	}
	
// Exporting remove function
// delete the section indicated for the course received as parameter
// If either the course or the section does not exist,
// it considers it removed anyway
exports.delete_section = function(req,res) 
	{		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	console.log("course",courseId);
	console.log("section",sectionId);
	// var courseId = req.params.id;
	Courses.findOne({"name" : courseId}, function(err, course){
        if (err) { res.status(500).send(err);} 
		else if (course) 
			{ 
			console.log("course",course);
			var sections = course["sections"];
			console.log("sections",sections);
			var len = sections.length;
			for (var i = 0; i < len; i++) {					
					var elem = sections[i];
					console.log("elem ",i,"\n",elem);
					if (elem.name == sectionId)
						{
							course["sections"].splice(i,1);
							console.log("course[sections]",course["sections"])
							// res.send("course: "+courseId+"\nsection:\n"+sectionId+"removed");
							course.save(function (err) {
								if(!err) {
									console.log("course: "+courseId+"\nsection:\n"+sectionId+"removed");
									res.send("course: "+courseId+"\nsection:\n"+sectionId+"removed");
									res.end();
									// res.end("course: "+courseId+"\nsection:\n"+sectionId+"removed");
									// console.log("contact " + contact.phone + " created at " + contact.createdAt + " updated at " + contact.updatedAt);
								}
								else {
									console.log("Error: could not save course " + err);
									res.send("Error: could not save course " + err);
									res.end();
								}								
							});
						};
			}			
			res.send("course: "+courseId+" section: "+sectionId+" not found");			
			} 
			else { res.sendStatus(404);}    
	});	
};

function exist_section(sectionId,sections){
	console.log('verifying if already exists section',sectionId);
	console.log(sections);
	// if (sections.length > 0)
		// { 	
			// if there are some sections, we have to
			// verify that the 'new' section does not
			// already exists. In this case, it is an ERROR			
	var resp = sections.some(function(elem) 
		{
			console.log('elem.name, sectionId',elem.name, sectionId);
			var cmp = sectionId.localeCompare(elem.name);
			console.log('comparing',cmp);
			if ( cmp === 0 ) { console.log('string match');
				return true;
				}
		}
	);
	console.log('forEach end ',resp);
	return resp;
		// if (resp === true){return true;}
		// else {return false;}
		// }
}

exports.create_section2 = function(req, res) {	
	var courseId = req.body.course,
		new_sec = req.body.section,
		sectionId = new_sec.name;
		
	console.log('Creating section ',sectionId,'in course ',courseId);	
	console.log('section body',new_sec);	
	
	Courses.findOne({"name" : courseId}, 
		function (err, course){
			if (err) { res.status(500).send(err);} 
			else {
				console.log('old course object',course);
				var sections = course["sections"];
				if (exist_section(sectionId,sections)){
					console.error('error section already exist');
					res.end('error section already exist');
				}
				else {
					console.log('section does not exist previously');
					// if there were no sections before OR
					// the new section does not already exists
					// then we have to insert it in the array			
					// push the new section at the end of the sections array					
					// sections.push(new_sec);
					sections[sections.length] = new_sec;
					console.log('new sections',sections);
					console.log('calling update_course_field');
					var err1 = controller.update_course_field(courseId,"sections",sections);
					if (err1) {
						console.error('error while updating '+err);
						res.end('error while updating '+err)
						}
						else res.end('Updated the course with id: ' + JSON.stringify(course));
					}
			}
		}
	);
}
		
// Exporting create_section function
// It receives as the body of the request in JSON format
// the Id (name) of the course where the section 
// should be created and the section Id (name) to be created and
// the information about the section as the body of the
// request in JSON format
// Example: localhost:8000/botbloq/v1/its/courses/course/Course2/section/Section2.1
// JSON: { "course" : "Course2", "section" : "Section2.1","resume": "section resume","lessons":[]}
// Up to the moment, it has not be possible to insert the new property
// and value in the course
exports.create_section = function(req, res) {	
	console.log('course body',req.body);
	var courseId = req.body.course,
		sectionId = req.body.section;
		// resume = req.body.resume;
	
	console.log('Creating section',courseId);	
	console.log('course body',req.body);	
	
	Courses.findOne({"name" : courseId}, 
		function (err, course) 
			{
			if (err) { res.status(500).send(err);} 
			console.log('old course object',course);
			if (course["sections"].lenth > 0)
				{ 	// if there are some sections, we have to
					// verify that the 'new' section does not
					// already exists. In this case, it is an ERROR		
				course["sections"].forEach(function(elem) 
					{if (elem.name == sectionId)
						{
						console.error('ERROR!');
						res.send('error section already exist');
						}	
					});
				}
			// if there were no sections before OR
			// the new section does not already exists
			// then we have to insert it in the array			
			// push the new section at the end of the sections array
			var new_sec = {name: sectionId,
							resume  : req.body.resume, 
							lessons  : []
							};
			course["sections"] = course.sections.push(new_sec);
			console.log('new course body\n',course);
			// course.save();
			course.save(function (err) {
				if(err) {
					console.error('ERROR!');
					res.send('error while updating '+err)
				}
			res.end('Updated the course with id: ' + JSON.stringify(course));
			});
			
	});
};
	

// exports.create1 = function (req, res) 
	// {
	// console.log('params',req.params);
	// var courseId = req.params.course
	// console.log('courseId ',courseId);	
	// Courses.findOne({"name" : courseId}, function(err, course) 
		// {
        // if (err) { res.status(500).send(err);} 
		// else if (course) { 
				// var sectionId = req.params.section
				// console.log('sectionId ',sectionId);
				// console.log('section body',req.body);
				// console.log('course obj',course);
				// var aux = course;
				// if ('sections' in course) {console.log('esta --> agregarla');
				// // hay que averiguar si la section no existía ya
				// // y falta agregarla
				// }
				// else {console.log('no esta --> crear el campo con esa section');
					// var field = "sections"
					// course[field] = { sectionId : req.body }; // {"prueba":333};esto tampoco funciona
					// console.log('course updated',course);
					// course.save(function (err) {
						// if(err) {
							// console.error('ERROR!');
							// res.send('error while updating');
						// };
					// });
				// }
				// res.end('Section ' + sectionId + ' created in ' + courseId);
				// // res.status(200).json(course); 
				// } 
			 // else { res.sendStatus(404);}    
		// }
	// );    
// };

	

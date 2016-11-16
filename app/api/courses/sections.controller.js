'use strict';

/*
This version works with the following exported functions.
function all: list all sections from a course
function get_section: list the indicated section from a course
function create_section: creates a new section for the indicated
	course. If the there exists a section with the same name, gives
	an error message
function delete_section: delete the section indicated for the course received as parameter
	If either the course or the section does not exist, it considers it removed anyway
function update_section: update the section indicated for the course received as parameter
	If the section already exist, it updates the section
	If section doesn't exist previously, it sets an error

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

function exist_section(sectionId,sections){
	console.log('verifying if already exists section',sectionId);
	console.log("sections\n",sections);	
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
}

// Exporting create_section function
// It receives as the body of the request in JSON format
// the name of the course where the section should be created and 
// the section name to be created and the information about the section 
// It verifies if the section already exist, in which case, it sets an error
// If section doesn't exist previously, it creates the new section
// Example: 
// {
	// "course":"Course1",
	// "section":{  
    		// "name": "Section1.3",
       		// "resume": "Section1.3 resume",
       		// "lessons": [] 
	  // }
// }

exports.create_section = function(req, res) {	
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

// Exporting update_section function
// It receives as the body of the request in JSON format
// the name of the course where the section should be created and 
// the section name to be created and the new information about the section 
// If the section already exist, it updates the section
// If section doesn't exist previously, it sets an error
// Example: 
// {
	// "course":"Course1",
	// "section":{  
    		// "name": "Section1.3",
       		// "resume": "Section1.3 resume",
       		// "lessons": [] 
	  // }
// }

exports.update_section = function(req, res) {	
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
				var ind = find_section(sectionId,sections);
				if ( ind < 0 ){
					console.error('error section does not exist');
					res.end('error section does not exist');
				}
				else {
					console.log('section already exist');
					course["sections"].splice(ind,1); //remove old section
					sections[sections.length] = new_sec; //push the new one
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

function find_section(sectionId,sections){
	console.log('find the section index position. Otherwise -1',sectionId);
	console.log("sections\n",sections);	
	// verify that the 'new' section does not
	// already exists. In this case, it is an ERROR	
	console.log("sections",sections);
	var len = sections.length;
	for (var i = 0; i < len; i++) {		
		var elem = sections[i];
		console.log("elem ",i,"\n",elem);
		var cmp = sectionId.localeCompare(elem.name);
		console.log('comparing',cmp);
		if ( cmp === 0 ) 
			{ 
				console.log('string match');
				return i;
			}
	}
	return -1;
}
		
// Exporting delete_section function
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
				var ind = find_section(sectionId,course["sections"]);
				if (ind < 0) {res.send("course: "+courseId+" section: "+sectionId+" not found");}
				else {
					course["sections"].splice(ind,1);
					console.log("new sections",course["sections"]);
					console.log('calling update_course_field');
					var err1 = controller.update_course_field(courseId,"sections",course["sections"]);
					if (err1) {
						console.error('error while updating '+err);
						res.end('error while updating '+err)
						}
						else res.end('Updated the course with id: ' + JSON.stringify(course));
				}						
			} 
			else { res.sendStatus(404);}    
	});	
};
	

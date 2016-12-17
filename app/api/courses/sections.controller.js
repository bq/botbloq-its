'use strict';

/*
This version works with the following exported functions.
function all_sections: list all sections from a course
function get_section: list the indicated section from a course
function create_section: creates a new section for the indicated
	course. If the there exists a section with the same name, gives
	an error message
function delete_section: delete the section indicated for the course received as parameter
	If either the course or the section does not exist, it considers it removed anyway
function update_section: update the section indicated for the course received as parameter
	If the section already exist, it updates the section
	If section doesn't exist previously, it sets an error
function update_section_field: updates just a field of a section
// It receives as the body of the request in JSON format
// the names of the course, the section and the field and 
// the new value of the field 
*/

var Courses = require('./courses.model.js'),
	Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    async = require('async'),
    _ = require('lodash');
var controller = require('./courses.controller.js');
	
// Exporting function all_sections
// list all sections from a course
exports.all_sections = function (req, res) {	
	var courseId = req.params.course_id;
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err) {
			res.status(500).send(err);
		} else{
			if (!course) {
				res.status(404).send('The course with id: ' + req.params.id + ' is not registrated');  
			} else {
				res.status(200).send(course.sections);
			}
		}
	});
};

// Exporting function get_section
// list the indicated section from a course
// If the section does not exists, prints a message
exports.get_section = function (req, res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	
	Courses.findOne({'name' : courseId}, function(err, course) {
        if (err){
			res.status(500).send(err);
		} else{
			if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');   
			} else {
				var sections = course.sections;
				var len = sections.length;
				for (var i = 0; i < len; i++) {
					var elem = sections[i];
					if (elem.name === sectionId){
						res.status(200).send('course: '+courseId+'\nsection:\n'+JSON.stringify(elem));
					}
				}			
				res.status(404).send('The section with id : ' + sectionId +
				' has not been found un the course with id: ' + courseId);	
			}
		} 
	});	
};

function exist_section(sectionId,sections){
	// verify that the 'new' section does not
	// already exists. In this case, it is an ERROR			
	var resp = sections.some(function(elem) 
		{
			var cmp = sectionId.localeCompare(elem.name);
			if ( cmp === 0 ) {
				return true;
				}
		}
	);
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
	// 'course':'Course1',
	// 'section':{  
    		// 'name': 'Section1.3',
       		// 'resume': 'Section1.3 resume',
       		// 'lessons': [] 
	  // }
// }

exports.create_section = function(req, res) {	
	var courseId = req.body.course,
		new_sec = req.body.section,
		sectionId = new_sec.name;
		
	
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err){
			res.status(500).send(err); 
		} else {
			var sections = course.sections;
			if (exist_section(sectionId,sections)){
				res.status(400).send('Error section already exist');
			}
			else {
				// if there were no sections before OR
				// the new section does not already exists
				// then we have to insert it in the array			
				// push the new section at the end of the sections array					
				// sections.push(new_sec);
				sections[sections.length] = new_sec;
				var err1 = controller.update_course_field(courseId,'sections',sections);
				if (err1){ 
					res.status(400).send('error while updating '+err);
				} else {
					res.status(200).send(new_sec);
				}
			}
		}
	});
}

// Exporting update_section function
// It receives as the body of the request in JSON format
// the name of the course where the section should be created and 
// the section name to be created and the new information about the section 
// If the section already exist, it updates the section
// If section doesn't exist previously, it sets an error
// Example: 
// {
	// 'course':'Course1',
	// 'section':{  
    		// 'name': 'Section1.3',
       		// 'resume': 'Section1.3 resume',
       		// 'lessons': [] 
	  // }
// }

exports.update_section = function(req, res) {	
	var courseId = req.body.course,
		new_sec = req.body.section,
		sectionId = new_sec.name;
	
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err){
			res.status(500).send(err);
		} else {
			var sections = course.sections;
			var ind = find_section(sectionId,sections);
			if (ind < 0){
				res.statu(404).send('Error section does not exist');
			 } else {
				course.sections.splice(ind,1); //remove old section
				sections[sections.length] = new_sec; //push the new one
				var err1 = controller.update_course_field(courseId,'sections',sections);
				if (err1) {
					res.status(400).send('error while updating '+err);
				} else {
					res.staus(200).send('Updated the course with id: ' + JSON.stringify(course));
				}
			}
		}
	});
};

// Exporting update_section_field function
// It receives as the body of the request in JSON format
// the names of the course, the section and the field and 
// the new value of the field 
// Example: 
// { 
    // 'course': 'Course1',
    // 'section': 'Section1.1',
    // 'field':'resume',
    // 'value': 'Section1.1 new resume'
  // }

exports.update_section_field = function(req, res) {	
	var courseId = req.body.course,
		sectionId = req.body.section,
		field = req.body.field,
		value = req.body.value;
		
	Courses.findOne({'name' : courseId}, function (err, course){
		if (err) {
			res.status(500).send(err);
		} else {
			var sections = course.sections;
			var ind = find_section(sectionId,sections);
			if ( ind < 0 ) {
				res.status(404).send('Error section does not exist');
			} else {
				var sec = sections[ind];
				sec[field] = value;
				var err1 = controller.update_course_field(courseId,'sections',sections);
				if (err1){
					res.status(400).send('Error while updating ' + err)
				} else {
					res.status(200).send('Updated the course with id: ' + JSON.stringify(course));
				}
			}
		}
	});
}

function find_section(sectionId,sections){

	// verify that the 'new' section does not
	// already exists. In this case, it is an ERROR	
	var len = sections.length;
	for (var i = 0; i < len; i++) {		
		var elem = sections[i];
		var cmp = sectionId.localeCompare(elem.name);
		if ( cmp === 0 ) { 
			return i;
		}
	}
	return -1;
}
		
// Exporting delete_section function
// delete the section indicated for the course received as parameter
// If either the course or the section does not exist,
// it considers it removed anyway
exports.delete_section = function(req,res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;

	// var courseId = req.params.id;
	Courses.findOne({'name' : courseId}, function(err, course){
        if (err){
			res.status(500).send(err);
		} else {
			if (!course) {
				res.sendStatus(404).send('The course with id: ' + courseId + ' is not rgistrated');  
			} else{
				var ind = find_section(sectionId,course.sections);
				if (ind < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {
					course.sections.splice(ind,1);
					var err1 = controller.update_course_field(courseId,'sections',course.sections);
					if (err1) {
						res.status(400).send('error while updating '+err)
					} else { 
						res.status(200).send('Updated the course with id: ' + JSON.stringify(course));
					}
				}						
			} 
		} 
	});	
};
	

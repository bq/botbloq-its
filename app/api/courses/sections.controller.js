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
    CoursesFunctions = require('./courses.functions.js'),
    async = require('async'),
    mongoose = require('mongoose'),
    _ = require('lodash');
var controller = require('./courses.controller.js');
	
// Exporting function all_sections
// list all sections from a course
exports.all_sections = function (req, res) {	
	var courseId = req.params.course_id;
	if(mongoose.Types.ObjectId.isValid(req.params.course_id)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
				res.sendStatus(err);
			} else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				res.status(200).send(course.sections);
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting function get_section
// list the indicated section from a course
// If the section does not exists, prints a message
exports.get_section = function (req, res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
			if (err){
				res.sendStatus(err);
			} else if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated');   
			} else {
				var sections = course.sections;
				var len = sections.length;
				var bool = false;
				for (var i = 0; i < len; i++) {
					var elem = sections[i];
					if (elem.name === sectionId){
						res.status(200).send(elem);
						bool = true;
					}
				}			
				if (!bool){
					res.status(404).send('The section with id : ' + sectionId 
					+ ' has not been found un the course with id: ' + courseId);	
				}
			} 
		});	
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

// Exporting create_section function
// It receives as the body of the request in JSON format
// the information about the section 
// It verifies if the section already exist, in which case, it sets an error
// If section doesn't exist previously, it creates the new section


exports.create_section = function(req, res) {	
	var courseId = req.params.id,
		new_sec = req.body,
		sectionId = new_sec.name;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				res.sendStatus(err); 
			} else if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var sections = course.sections;
				if (CoursesFunctions.exist_section_lesson(sectionId,sections) !== -1){
					res.status(400).send('Error section already exist');
				}
				else {
					// if there were no sections before OR
					// the new section does not already exists
					// then we have to insert it in the array			
					// push the new section at the end of the sections array					
					sections.push(new_sec);
					
					if (res.statusCode !== 200){ 
						res.status(400).send('error while updating '+err);
					} else {
						res.status(200).send(sections[sections.length-1]);
					}
					course.save();
				}
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
}

// Exporting update_section function
// It receives as the body of the request in JSON format
// the new information about the section to update
// If the section already exist, it updates the section
// If section doesn't exist previously, it sets an error


exports.update_section = function(req, res) {	
	var courseId = req.params.id,
		new_sec = req.body,
		sectionId = new_sec.name;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				res.sendStatus(err);
			}else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var sections = course.sections;
				var ind = CoursesFunctions.exist_section_lesson(sectionId,sections);
				if (ind < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				 } else {
					course.sections[ind] = CoursesFunctions.doUpdate(course.sections[ind] , new_sec);
					if (res.statusCode !== 200) {
						res.status(400).send('error while updating '+err);
					} else {
						res.status(200).send(sections[sections.length-1]);
					}
					course.save();
				}
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

		
// Exporting delete_section function
// delete the section indicated for the course received as parameter
// If either the course or the section does not exist,
// it considers it removed anyway
exports.delete_section = function(req,res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;

	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course){
	        if (err){
				res.sendStatus(err);
			} else if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');  
			} else{
				var ind = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (ind < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found un the course with id: ' + courseId);
				} else {
					course.sections.splice(ind,1);

					if (res.statusCode !== 200) {
						res.status(400).send('error while updating '+err)
					} else { 
						res.status(200).send({ok:1, n: 1});
					}
					course.save();
				}						
			}  
		});	
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};
	

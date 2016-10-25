'use strict';

var Students = require('./students.model.js'),
   config = require('../../res/config.js'), 
   async = require('async'),
   _ = require('lodash');


//ALL STUDENTS
exports.all = function (req, res) {
    Students.find({}, function (err, student) {
        if (err) throw err;
        res.json(student);
    });
};

/**
 * Creates a new element
 */
exports.create = function(req, res) {
    Students.create(req.body, function (err, student) {
        if (err) throw err;
        console.log('Student created!');
        var id = student._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the student with id: ' + id);
    });
};



exports.destroy  = function(req, res){
    Students.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
};


//BY ID	
exports.get = function (req, res) {
    console.log(req.params.id)
    Students.findById(req.params.id, function (err, student) {
       if (err) throw err;
        res.json(student);
    });
};



exports.update = function (req, res) {
    Students.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }, function (err, student) {
        if (err) throw err;
        res.json(student);
    });
};


exports.remove = function (req, res) {
    console.log(req.params.id)
    Students.findByIdAndRemove(req.params.id, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
};




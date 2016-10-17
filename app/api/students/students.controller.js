var express = require('express'); // FRM ??
var bodyParser = require('body-parser'); // FRM ??

var Students = require('../../data-access/models/student');
 //   config = require('../../res/config.js'), // FRM configuracion de la BD
 //   async = require('async'),
 //   _ = require('lodash');

var studentRouter = express.Router();
studentRouter.use(bodyParser.json());


//ALL STUDENTS
studentRouter.route('/')
.get(function (req, res, next) {
    Students.find({}, function (err, student) {
        if (err) throw err;
        res.json(student);
    });
})
.post(function(req, res, next){
    Students.create(req.body, function (err, student) {
        if (err) throw err;
        console.log('Student created!');
        var id = student._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the student with id: ' + id);
    });
})

.delete(function(req, res, next){
    Students.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


//BY ID	
studentRouter.route('/:studentId')
.get(function (req, res, next) {
    Students.findById(req.params.studentId, function (err, student) {
       if (err) throw err;
        res.json(student);
    });
})

.put(function (req, res, next) {
    Students.findByIdAndUpdate(req.params.studentId, {
        $set: req.body
    }, {
        new: true
    }, function (err, student) {
        if (err) throw err;
        res.json(student);
    });
})

.delete(function (req, res, next) {
    Students.findByIdAndRemove(req.params.studentId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = studentRouter;
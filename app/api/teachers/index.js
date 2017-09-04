'use strict';
/* jshint node: true */


var express = require('express');
var controller = require('./teachers.controller.js'); 

var router = express.Router();



/////////////////////////////// GETs

// login a teacher
router.get('/:name/password/:pass', controller.login);

// gets a teacher
router.get('/:id', controller.get); 

// gets all teachers
router.get('/', controller.all);



//////////////////////////// POSTs

// creates a teacher
router.post('/', controller.create); 



/////////////////////////// PUTs

// updates a teacher
router.put('/:id',  controller.update);




////////////////////////// DELETEs

 //deletes a teacher
router.delete('/:id',  controller.remove);

// destroys all teachers
router.delete('/',  controller.destroy);



module.exports = router;

'use strict';

var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();


// GETs
router.get('/', controller.all);
router.get('/:id', controller.get);


// POSTs
router.post('/', controller.create); // create

//LOCKs

router.unlock('/:id', controller.activate) // activate
router.lock('/:id', controller.deactivate) // deactivate

// PUTs
router.put('/:id',  controller.update);// update

router.put('/:idstd/course/:idc', controller.enrollment); //enrollment


// DELETEs

router.delete('/',  controller.destroy);// destroy
router.delete('/:id',  controller.remove); //delete



module.exports = router;

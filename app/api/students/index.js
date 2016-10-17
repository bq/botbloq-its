'use strict';

var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();

// HEADs
//router.head('/:email', controller.emailExists);

// GETs
// router.get('/:id', controller.show);

router.get('/', controller.all);
router.get('/:id', controller.get);


// POSTs
router.post('/', controller.create); // create


// PUTs
router.put('/:id',  controller.update);// update

// DELETEs

router.delete('/',  controller.destroy);


router.delete('/:id',  controller.remove);



module.exports = router;

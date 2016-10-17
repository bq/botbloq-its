'use strict';

var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();

// HEADs
//router.head('/:email', controller.emailExists);

// GETs
// router.get('/:id', controller.show);

router.get('/', controller.all);
router.get('/:id', controller.get)



// POSTs
router.post('/', controller.create)


// PUTs
router.put('/:id', controller.update);

// DELETEs

router.delete('/', controller.deleteAll);
router.delete('/:studentID', controller.deleteOne);



module.exports = router;

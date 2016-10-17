'use strict';

var express = require('express');
var controller = require('./students.controller.js'); // FRM lo he cambiado

var router = express.Router();

// HEADs
router.head('/:email', controller.emailExists);

// GETs
router.get('/:id', controller.show);

// POSTs
router.post('/', controller.create);

// PUTs
router.put('/me', controller.update);

// DELETEs
router.delete('/:id', controller.destroy);


module.exports = router;

'use strict';

var express = require('express');
var controller = require('./loms.controller.js');

var router = express.Router();

// PUTs
router.put('/me', controller.create);


module.exports = router;

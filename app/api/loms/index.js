'use strict';

var express = require('express');
var controller = require('./lom.controller.js');

var router = express.Router();

// PUTs
router.put('/me', controller.insert);


module.exports = router;

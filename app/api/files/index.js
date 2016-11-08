'use strict';

var express = require('express');
var controller = require('./files.controller.js'); 
var multer = require('multer');
var router = express.Router();

router.get('/fileupload.html', controller.get);

var upload = multer({ dest: '/tmp' })

router.post('/file_upload', upload.single("file"), controller.post);

module.exports = router;

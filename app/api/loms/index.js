'use strict';
/* jshint node: true */

var express = require('express');
var controller = require('./loms.controller.js');
var multer = require('multer');

var router = express.Router();
var upload = multer({ dest: '/tmp' });



//////////////////////////// GETs

//downloads a file of a lom
router.get('/:id/download/:file', controller.downloadFile);

//gets a lom selected
router.get('/:id', controller.get);

//gets all loms
router.get('/', controller.all);



/////////////////////////// POSTS

// uploads a photo in a lom
router.post('/:id/includePhoto', upload.single('file'), controller.includePhoto);

// uploads a file in a lom
router.post('/:id/upload', upload.single('file'), controller.uploadFile);

// creates a lom
router.post('/', controller.create);



/////////////////////////// PUTs

// updates a loms
router.put('/:id', controller.update);



/////////////////////////// DELETEs

// destroys a lom
router.delete('/:id',  controller.remove);

// destroys all loms
router.delete('/',  controller.destroy);



module.exports = router;

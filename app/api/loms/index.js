'use strict';

var express = require('express');
var controller = require('./loms.controller.js');
var multer = require('multer');

var router = express.Router();
var upload = multer({ dest: '/tmp' })



//////////////////////////// GETs

//gets all loms
router.get('/', controller.all);

//gets a lom selected
router.get('/:id', controller.get);

//downloads a file of a lom
router.get('/:id/download/:file', controller.downloadFile);


/////////////////////////// POSTS

// creates a lom
router.post('/', controller.create);

// uploads a file in a lom
router.post('/:id/upload', upload.single('file'), controller.uploadFile);
//router.post('/:id/upload', controller.uploadFile);


/////////////////////////// PUTs

// updates a loms
router.put('/:id', controller.update);


/////////////////////////// DELETEs

// destroys all loms
router.delete('/',  controller.destroy);

// destroys a lom
router.delete('/:id',  controller.remove);



module.exports = router;

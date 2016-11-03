'use strict';

var express = require('express');
var controller = require('./loms.controller.js');

var router = express.Router();




// GETs
router.get('/', controller.all);
router.get('/:id', controller.get);

// POSTS
router.post('/', controller.create);


// PUTs
router.put('/:id', controller.update);

// DELETEs
router.delete('/',  controller.destroy);
router.delete('/:id',  controller.remove);





module.exports = router;

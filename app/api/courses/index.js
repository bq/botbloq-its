<<<<<<< HEAD
'use strict';

var express = require('express');
var controller = require('./courses.controller.js');

var router = express.Router();

// GETs
router.get('/', controller.all); // list all courses
router.get('/:id', controller.get); // list the indicated course 

// POSTs
router.post('/', controller.create); // create a Course by the object

// PUTs
router.put('/Update', controller.update1);
router.put('/:id', controller.update);

// DELETEs
router.delete('/:id', controller.remove);


=======
'use strict';

var express = require('express');
var controller = require('./courses.controller.js');
var section_ctrl = require('./sections.controller.js');

var router = express.Router();

/*
**************SECTIONS******************************
*/

// POSTs
router.post('/course/:course/section/:section', section_ctrl.create);
// router.post('/term/:term/location/:location', section_ctrl.prueba); // create a Section by the object
// router.get('/term/:term/location/:location', controller.prueba);
// router.post('/term/:courses/location/:sections', controller.create);

/*
**************COURSES******************************
*/

// GETs
router.get('/', controller.all); // list all courses
router.get('/:id', controller.get); // list the indicated course 

// POSTs
router.post('/', controller.create); // create a Course by the object

// PUTs
router.put('/Update', controller.update1);
router.put('/:id', controller.update);

// DELETEs
router.delete('/:id', controller.remove);


>>>>>>> c797859d283f2bca89d187ff31516f19dca13731
module.exports = router;
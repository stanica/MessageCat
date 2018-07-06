'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./esp.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/instagram/:id', controller.getFollowers);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./file.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.get('/:id/list', controller.list);
router.get('/:id/update', controller.getUpdate);
router.get('/:id/uploads/:file', controller.getFile);
router.get('/:id/boot/:file', auth.isAuthenticated(), controller.setBoot);
router.post('/', controller.create);
router.post('/:id/log', controller.log);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;

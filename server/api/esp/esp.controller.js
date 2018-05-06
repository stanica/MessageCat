/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/esp              ->  index
 * POST    /api/esp              ->  create
 * GET     /api/esp/:id          ->  show
 * PUT     /api/esp/:id          ->  upsert
 * PATCH   /api/esp/:id          ->  patch
 * DELETE  /api/esp/:id          ->  destroy
 */

'use strict';

import { applyPatch } from 'fast-json-patch';
import Esp from './esp.model';
var fs = require('fs');
var rimraf = require('rimraf');
const path = require('path');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      applyPatch(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          if (typeof parseInt(entity.chipId) === 'number' && fs.existsSync(path.resolve('server/uploads/' + '/' + entity.chipId + '/'))){
            rimraf(path.resolve('server/uploads/' + '/' + entity.chipId + '/'), function () {
              console.log('Deleted ' + entity.chipId + '/');
            });
          }
          res.status(204).end()
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Esps
export function index(req, res) {
  if(req.user.role === 'admin'){
    return Esp.find().exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  else {
    return Esp.find({email:req.user.email}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  }
}

// Gets a single Esp from the DB
export function show(req, res) {
  return Esp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Esp in the DB
export function create(req, res) {
  return Esp.create(req.body)
    .then(esp => {
      if (!fs.existsSync(path.resolve('server/uploads/' + '/' + esp.chipId + '/'))){
        fs.mkdirSync(path.resolve('server/uploads/' + '/' + esp.chipId + '/'));
      }
      return respondWithResult(res, 201)(esp);
    })
    .catch(handleError(res));
}

// Upserts the given Esp in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Esp.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Esp in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Esp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Esp from the DB
export function destroy(req, res) {
  return Esp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/files              ->  index
 * POST    /api/files              ->  create
 * GET     /api/files/:id          ->  show
 * PUT     /api/files/:id          ->  upsert
 * PATCH   /api/files/:id          ->  patch
 * DELETE  /api/files/:id          ->  destroy
 */

'use strict';

import { applyPatch } from 'fast-json-patch';
import File from './file.model';
import Esp from '../esp/esp.model';
const fs = require('fs');
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
        .then(() => res.status(204).end());
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

// Gets a list of Files
export function index(req, res) {
  return File.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single File from the DB
export function show(req, res) {
  return File.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of files for a chip id
export function list(req, res) {
  return Esp.findOne({'chipId':req.params.id}).exec()
    .then(handleEntityNotFound(res))
    .then(esp => {
      return File.find({espId:esp.id}).sort({boot:-1}).exec(function(err, files){
        if(!files) {
         return res.status(404).end();
        }
        var result = '';
        for(var x=0; x<files.length; x++){
          if(x !== files.length-1){
            result += files[x].fileName + '\n';
          }
          else {
            result += files[x].fileName;
          }
        }
        result = result.trim();
        res.writeHead(200, {'Content-Type':'text/json','Transfer-Encoding':'Identity'});
        res.write(result);
        res.end();
        //respondWithResult(res, 200)(result);
      });
    })
    .catch(handleError(res));
}

// Gets file content for a single file
export function getFile(req, res) {
  fs.readFile(path.resolve('server/uploads/') + '/' + req.params.id + '/' + req.params.file, "utf8", function(err, data){
    if(!err){
      res.writeHead(200, {'Content-Type':'text/json','Transfer-Encoding':'Identity'});
      res.write(data);
      res.end();
      //return respondWithResult(res, 200)(data);
    }
    else {
      return handleError(res)(err);
    }
  });
}

// Gets update status for ESP board
export function getUpdate(req, res) {
  return Esp.findOne({'chipId':req.params.id}).exec()
    .then(handleEntityNotFound(res))
    .then((esp, err) => {
      if(err){
        return handleError(res)(err);
      }
      res.writeHead(200, {'Content-Type':'text/json','Transfer-Encoding':'Identity'});
      if(esp.update === 1){
        res.write('UPDATE');
        esp.update = 0;
      }
      else {
        res.write('');
      }
      res.end();
      esp.heartbeat = Date.now();
      esp.save();
    });
}

// Creates a new File in the DB
export function create(req, res) {
  return File.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given File in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return File.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing File in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return File.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a File from the DB
export function destroy(req, res) {
  return File.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

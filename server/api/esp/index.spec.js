'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var espCtrlStub = {
  index: 'espCtrl.index',
  show: 'espCtrl.show',
  create: 'espCtrl.create',
  upsert: 'espCtrl.upsert',
  patch: 'espCtrl.patch',
  destroy: 'espCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var espIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './esp.controller': espCtrlStub
});

describe('Esp API Router:', function() {
  it('should return an express router instance', function() {
    espIndex.should.equal(routerStub);
  });

  describe('GET /api/esp', function() {
    it('should route to esp.controller.index', function() {
      routerStub.get
        .withArgs('/', 'espCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/esp/:id', function() {
    it('should route to esp.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'espCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/esp', function() {
    it('should route to esp.controller.create', function() {
      routerStub.post
        .withArgs('/', 'espCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/esp/:id', function() {
    it('should route to esp.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'espCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/esp/:id', function() {
    it('should route to esp.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'espCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/esp/:id', function() {
    it('should route to esp.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'espCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});

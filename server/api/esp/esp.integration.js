'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newEsp;

describe('Esp API:', function() {
  describe('GET /api/esp', function() {
    var esps;

    beforeEach(function(done) {
      request(app)
        .get('/api/esp')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          esps = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      esps.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/esp', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/esp')
        .send({
          name: 'New Esp',
          info: 'This is the brand new esp!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newEsp = res.body;
          done();
        });
    });

    it('should respond with the newly created esp', function() {
      newEsp.name.should.equal('New Esp');
      newEsp.info.should.equal('This is the brand new esp!!!');
    });
  });

  describe('GET /api/esp/:id', function() {
    var esp;

    beforeEach(function(done) {
      request(app)
        .get(`/api/esp/${newEsp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          esp = res.body;
          done();
        });
    });

    afterEach(function() {
      esp = {};
    });

    it('should respond with the requested esp', function() {
      esp.name.should.equal('New Esp');
      esp.info.should.equal('This is the brand new esp!!!');
    });
  });

  describe('PUT /api/esp/:id', function() {
    var updatedEsp;

    beforeEach(function(done) {
      request(app)
        .put(`/api/esp/${newEsp._id}`)
        .send({
          name: 'Updated Esp',
          info: 'This is the updated esp!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedEsp = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEsp = {};
    });

    it('should respond with the updated esp', function() {
      updatedEsp.name.should.equal('Updated Esp');
      updatedEsp.info.should.equal('This is the updated esp!!!');
    });

    it('should respond with the updated esp on a subsequent GET', function(done) {
      request(app)
        .get(`/api/esp/${newEsp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let esp = res.body;

          esp.name.should.equal('Updated Esp');
          esp.info.should.equal('This is the updated esp!!!');

          done();
        });
    });
  });

  describe('PATCH /api/esp/:id', function() {
    var patchedEsp;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/esp/${newEsp._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Esp' },
          { op: 'replace', path: '/info', value: 'This is the patched esp!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedEsp = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedEsp = {};
    });

    it('should respond with the patched esp', function() {
      patchedEsp.name.should.equal('Patched Esp');
      patchedEsp.info.should.equal('This is the patched esp!!!');
    });
  });

  describe('DELETE /api/esp/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/esp/${newEsp._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when esp does not exist', function(done) {
      request(app)
        .delete(`/api/esp/${newEsp._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});

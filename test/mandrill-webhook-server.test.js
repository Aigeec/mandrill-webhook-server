(function() {
  'use strict';

  var expect = require('chai').expect;

  var config = {
    domain: 'http://test/com',
    webhookAuthKey: 'some_auth_key',
    url: '/webhook',
    forwardTo: 'test@example.com',
    mandrillApiKey: 'some_api_key',
  };

  var proxyquire =  require('proxyquire');
  var request = require('supertest');
  var express = require('express');

  var Q = require('bluebird');

  var forwarderStub = function() {
    return function() {
      var deferred = Q.defer();
      deferred.resolve();
      return deferred.promise;
    };
  };

  var mandrillServer = proxyquire('../src/mandrill-webhook', { './mandrill-webhook-mail-forwarder': forwarderStub });
  var server = mandrillServer(config);
  var app = express();

  describe('#mandrill-webhook', function() {

    app.use(server);

    it('should accept a configuration', function() {
      expect(mandrillServer.length).to.equals(1);
    });

    it('should return a function that accepts two parameters', function() {
      expect(server.length).to.equals(2);
    });

    it('should return 404 for invalid requests', function(done) {
      request(app).get('/webhook').expect(404, done);
    });

    it('should return 401 for requests with no mandrill signature', function(done) {
      request(app).post('/webhook').set('content-type', 'application/x-www-form-urlencoded').expect(401, done);
    });

    it('should return 403 for requests with invalid mandrill signatures', function(done) {
      request(app).post('/webhook').set('content-type', 'application/x-www-form-urlencoded').set('x-mandrill-signature', 'invalid').expect(403, done);
    });

    it('should return 200 for a valid request', function(done) {
      request(app)
      .post('/webhook')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('x-mandrill-signature', 'xHQjU8Pwhauh98J3jrI3Nb76OSI=')
      .send('mandrill_events=' + encodeURIComponent('[{"msg": {"from_email": "test@example.com"}}]'))
      .expect(200, done);
    });

    it('should return 500 in the event of an error', function(done) {
      var forwarderStub = function(config) {
        return function() {
          var deferred = Q.defer();
          deferred.reject();
          return deferred.promise;
        };
      };

      var mandrillServer = proxyquire('../src/mandrill-webhook', { './mandrill-webhook-mail-forwarder': forwarderStub });

      app = express();
      app.use(mandrillServer(config));

      request(app)
      .post('/webhook')
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('x-mandrill-signature', 'xHQjU8Pwhauh98J3jrI3Nb76OSI=')
      .send('mandrill_events=' + encodeURIComponent('[{"msg": {"from_email": "test@example.com"}}]'))
      .expect(500, done);

    });

    it('should default to the config if no options are provided', function() {
      var requestValidatorStub = function(config) {
        expect(config).to.deep.equal({});
      };

      proxyquire.noCallThru();

      var mandrillServer = proxyquire('../src/mandrill-webhook', {
        '../config': {},
        './mandrill-webhook-request-validator': requestValidatorStub,
        './mandrill-webhook-authenticator': function() {},
      })();
    });

  });

})();

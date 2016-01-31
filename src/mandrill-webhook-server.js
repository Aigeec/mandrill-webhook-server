(function() {
  'use strict';

  var _ = require('lodash');
  var Q = require('bluebird');
  var http = require('http');

  var requestValidator = require('mandrill-webhook-request-validator');
  var authenticator = require('mandrill-webhook-authenticator');
  var parser = require('mandrill-webhook-event-parser');
  var forwarder = require('mandrill-webhook-mail-forwarder');

  var MandrillWebhookServer = function(options) {

    if (!(this instanceof MandrillWebhookServer)) {
      return new MandrillWebhookServer(options);
    }

    var processPostBody = function(body) {
      var content = body.split('=');
      var postBody = {};
      if (content[1]) {
        postBody[content[0]] = decodeURIComponent(content[1].replace(/\+/g, ' '));
      }

      return postBody;
    };

    var bodyParser = function(req, res, next) {
      var body = '';

      req.on('data', function(data) {
        body += data;
      });

      req.on('end', function() {
        req.body = processPostBody(body);
        next();
      });
    };

    var returnOk = function(req, res) {
      res.writeHead(200);
      res.end('Ok');
    };

    var filters = [];

    filters.push(requestValidator(options));
    filters.push(bodyParser);
    filters.push(authenticator(options));
    filters.push(parser());
    filters.push(forwarder(options));
    filters.push(returnOk);

    var server = function(req, res) {
      var idx = 0;
      var processFilters = function(err) {
        if (!err) {
          var filter = filters[idx++];
          filter(req, res, processFilters);
        } else {
          res.writeHead(500);
          res.end(JSON.stringify(err));
        }
      };

      processFilters();
    };

    return server;
  };

  module.exports = MandrillWebhookServer;

})();

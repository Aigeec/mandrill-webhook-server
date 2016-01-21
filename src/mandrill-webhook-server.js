(function() {
  'use strict';

  var _ = require('lodash');
  var Q = require('bluebird');
  var config = require('../config');

  var requestValidator = require('./mandrill-webhook-request-validator');
  var authenticator = require('mandrill-webhook-authenticator');
  var parser = require('./mandrill-webhook-event-parser');
  var forwarder = require('./mandrill-webhook-mail-forwarder');

  var MandrillWebhookServer = function(options) {

    if (!(this instanceof MandrillWebhookServer)) {
      return new MandrillWebhookServer(options);
    }

    config = options || config;

    var processPostBody = function(body) {
      var content = body.split('=');
      var postBody = {};
      postBody[content[0]] = decodeURIComponent(content[1]);
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

    var forwardEvents = function(req, res, next) {

      var promises = _.map(req.mandrillEvents, forwarder(config));

      Q.all(promises).done(
        function() {
          res.writeHead(200);
          res.end('OK');
        },

        function(err) {
          err = err || { message: 'No message provided' };
          next(err);
        }
      );
    };

    var filters = [];

    filters.push(requestValidator(config));
    filters.push(bodyParser);
    filters.push(authenticator(config));
    filters.push(parser());
    filters.push(forwardEvents);

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

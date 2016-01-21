(function() {
  'use strict';

  var http = require('http');
  var mandrillWebhook = require('./src/mandrill-webhook.js');

  var server = http.createServer(mandrillWebhook());

  var port = 3000;

  server.listen(port, function() {
    console.log('Listening on port %s', port);
  });

})();

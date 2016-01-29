mandrill-webhook-server
=========
A small server to process Mandrill inbound web-hooks and uses Mandrill to forward the emails to another address.

## Installation

```bash
  npm install mandrill-webhook-server --save
```
## Usage
```javascript
(function() {
  'use strict';

  var http = require('http');
  var mandrillWebhookServer = require('mandrill-webhook-server.js');

  var server = http.createServer(mandrillWebhookServer());

  var port = 3000;

  server.listen(port, function() {
    console.log('Listening on port %s', port);
  });

})();
```
## Options

```javascript
var config = {
  mandrillApiKey: 'your_mandrill_key',
  webhookAuthKey: 'webhooks_auth_key',
  domain: 'http://www.example.com',
  url: '/webhook',
  forwardTo: 'example@example.com',
  dontForwardEmailsFrom: ['example@example.com'],
};
```

* **mandrillApiKey:** mandrill api key, used to send the emails
* **webhookAuthKey:** mandrill webhook auth key, used for validating the Mandrill Signature
* **domain:** domain of the webhook you set up on Mandrill, used for validating the Mandrill signature
* **url:** url of the webhook you set up on Mandrill, used for validating the Mandrill Signature and routing
* **forwardTo:** email to foward the messages to, where you want the mails sent
* **dontForwardEmailsFrom:** ignore any emails from this list of addresses

## Tests
```bash
  npm test
```

## Links

[api documentation](./docs/api.md)

[jscs Report](./docs/jscs.md)

[jshint Report](./docs/jshint.md)

## Contributing

Use [Airbnb jscs style guide](https://github.com/airbnb/javascript).

Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

Not yet released.

## Legal Stuff

mandrill-webhook-request-validator is Copyright 2016 Aodhagán Collins. All Rights Reserved.

Distributed under [MIT License](https://tldrlegal.com/license/mit-license).

mandrill-webhook
=========
A small express middleware to process Mandrill inbound webhooks and use Mandrill to forward the emails to another address.

## Installation

  npm install mandrill-webhook --save

## Usage

  var mandrillWebhook = require('mandrill-webhook')(options);

  # options

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

  **mandrillApiKey:** mandrill api key, used to send the emails

  **webhookAuthKey:** mandrill webhook auth key, used for validating the Mandrill Signature

  **domain:** domain of the webhook you set up on Mandrill, used for validating the Mandrill Signature

  **url:** url of the webhook you set up on Mandrill, used for validating the Mandrill Signature and routing

  **forwardTo:** email to foward the messages to, where you want the mails sent

  **dontForwardEmailsFrom:** ignore any emails from this list of addresses

## Tests

  npm test

## Contributing

  Use Airbnb style guide.
  Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

  Not yet released.

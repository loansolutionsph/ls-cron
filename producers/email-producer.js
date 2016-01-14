'use strict';

// Load core modules
var util = require('util');

// Load third-party modules
var Rabbus = require('rabbus');
var Rabbit = require('wascally');

// Email Producer
// --------------
function EmailProducer(options) {
  Rabbus.Sender.call(this, Rabbit, {
    exchange: 'send-rec.emails-exchange',
    routingKey: 'send-rec.emails-key',
    messageType: options.messageType
  });
}

util.inherits(EmailProducer, Rabbus.Sender);

// Exports
// -------
module.exports = EmailProducer;

'use strict';

// Load core modules
var req = require('request');
var config = require('config');

var options = {
  method: 'get',
  url: process.env.NODE_URL || config.get('api.url'),
  headers: {
    'Accept': 'application/json',
    'Authentication' : 'Bearer ' + process.env.NODE_TOKEN || config.get('token')
  }
};

options.url = options.url + '/oldleads';

req(options, function (error, response, body) {
  if( error ) {
    return console.log(error);
  }

    console.log(body);
});

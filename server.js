'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();

var req = require('request');
var config = require('config');

var apiConfig = config.get('server');

// Configure server connection
server.connection(apiConfig);

server.start(function(startErr) {
	if (startErr) {
		throw startErr;
	}

	require('./jobs');

	console.log('Server started at: ', server.info.uri);
});



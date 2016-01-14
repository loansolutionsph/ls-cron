'use strict';
var req = require('request');
var config = require('config');

var Rabbit = require('wascally');
var settings = config.util.extendDeep({}, config.get('rabbitmq'));

var apiConfig = config.get('server');


Rabbit.configure(settings)
.then(function() {
	var Hapi = require('hapi');
	var server = new Hapi.Server();

	// Configure server connection
	server.connection(apiConfig);

	server.start(function(startErr) {
		if (startErr) {
			throw startErr;
		}

		require('./jobs');

		console.log('Server started at: ', server.info.uri);
	});
})
.then(null, function(err) {
	setImmediate(function() {
		throw err;
	});
});

function exit(err) {
	Rabbit.closeAll()
	.then(function() {
		if (err) {
			throw err;
		}
	});
}

process.once('SIGINT', function() {
	exit(null);
});

process.on('unhandledException', function(err) {
	exit(err);
});

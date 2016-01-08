'use strict';

var req = require('request');
var config = require('config');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

var token = process.env.NODE_TOKEN || config.get('token');

var current = new Date();
var hourAgo = new Date(current - 1*60*60*1000);
var minAgo = new Date(current - 30*60*1000);
var dayAgo = new Date(current - 24*60*60*1000);
var weekAgo = new Date(current - 7*24*60*60*1000);

var options = {
	method: 'get',
	url: process.env.NODE_URL || config.get('api.url'),
	headers: {
		'Accept': 'application/json',
		'Authorization' : 'Bearer ' + token
	},
	qs : {},
	json: true
};

options.url = options.url + '/leads';

rule.second = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
schedule.scheduleJob(rule, function(){
	options.qs = {
		filter: {
			where: {
				'status': 1,
				'updatedAt' : {
					$lt: current,
					$gt: minAgo
				}
			}
		}
	};

	req(options, function (error, response, body) {
	  if( error ) {

		console.log(JSON.stringify(error));
	  } else {
	  	console.warn(body)
	  }

	});

	console.log(new Date(), 'Every ' + rule.second + ' minutes of the hour.');
});

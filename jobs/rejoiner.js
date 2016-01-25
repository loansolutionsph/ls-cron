'use strict';

// Third Party Modules
var req = require('request');
var config = require('config');
var schedule = require('node-schedule');

// Local Modules
var EmailProducer = require('../producers/email-producer');

// Config variable
var token = process.env.NODE_TOKEN || config.get('token');
var rule = new schedule.RecurrenceRule();
var tAgo = process.env.NODE_TAGO || 1*60*1000;

// Time variable
var current = new Date();
var minAgo = new Date(current - tAgo);
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
	current = new Date();
	minAgo = new Date(current - tAgo);

	options.qs = {
		filter: {
			where: {
				'status': 1,
				'updatedAt' : {
					$lte: minAgo // 10 minutes
				},
				'ReinvitedId': null
			},
			limit: 10
		}
	};

	req(options, function (error, response, body) {
		if( error ) {
			return console.log('Error : ' + JSON.stringify(error));
		}

		if (body.length) {
			var sendEmail = function(lead) {
				var message = {
					template: 'rejoiner',
					emailType: 'rejoiner',
					from: 'Chim of Loansolutions <hello@loansolutions.ph>',
					subject: 'Is there something wrong? We can help | Loansolutions.ph',
					data: lead
				};

				var emailProducer = new EmailProducer({
					messageType: 'rejoin.emails.send'
				});

				var optionReinvited = {
					method: 'put',
					url: process.env.NODE_URL || config.get('api.url'),
					headers: {
						'Accept': 'application/json',
						'Authorization' : 'Bearer ' + token
					},
					qs : {},
					json: true
				};

				optionReinvited.url = optionReinvited.url + '/leads/' + lead.id + '/rejoiner';

				emailProducer.send(message, {
					onComplete: function( ) {
						req(optionReinvited, function (error, response, body) {
							if( error ) {
								console.log(JSON.stringify(error));
							} else {
								console.log('Update lead : ' + lead.id);
							}
						});
					}
				});
			};

			body.forEach(function(lead) {
				sendEmail(lead);
			});
		} else {
			console.log('No more Drop-Off Yet!');
		}

	});

	console.log(new Date(), ' Every ' + rule.second + ' second of the minutes.');
});


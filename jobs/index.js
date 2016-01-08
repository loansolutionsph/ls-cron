'use strict';

var path = require('path');
var helpers = require('../helpers');

var options = {
  dirName: __dirname,
  basename: path.basename(module.filename)
};
var consumers = {};

helpers.readDirFiles(options, function(fileName) {
  var consumerName = path.basename(fileName, '.js');
  consumers[consumerName] = require('./' + fileName);
});

module.exports = consumers;

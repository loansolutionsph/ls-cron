'use strict';

// Load core modules
var fs = require('fs');

// Local declarations
var helpers = {
  readDirFiles: function(options, cb) {
    var basename = options.basename || 'index.js';

    fs
      .readdirSync(options.dirName)
      .filter(function(fileName) {
        return (fileName.indexOf('.') !== 0 && fileName !== basename);
      })
      .forEach(function(fileName) {
        if (fileName.slice(-3) !== '.js') {
          return;
        }

        cb(fileName);
      });
  }
};

// Exports
// -------
module.exports = helpers;

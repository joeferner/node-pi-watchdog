'use strict';

var path = require('path');

var binaryPath = path.resolve(path.join(__dirname, "../build/Release/nodepiwatchdog_bindings.node"));
var bindings = require(binaryPath);

module.exports = new bindings.PiWatchdog();

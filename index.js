'use strict';

var path = require('path');

var binaryPath = path.resolve(path.join(__dirname, "./build/Release/nodepiwatchdog_bindings.node"));
var bindings = require(binaryPath);

var piWatchdog = new bindings.PiWatchdog();
var WATCHDOG_FILE_NAME = "/dev/watchdog";

exports.getTimeout = function(callback) {
  return piWatchdog.getTimeout(WATCHDOG_FILE_NAME, callback);
};

exports.setTimeout = function(timeout, callback) {
  return piWatchdog.setTimeout(WATCHDOG_FILE_NAME, timeout, callback);
};

exports.heartbeat = function(callback) {
  return piWatchdog.heartbeat(WATCHDOG_FILE_NAME, callback);
};

exports.disable = function(callback) {
  return piWatchdog.disable(WATCHDOG_FILE_NAME, callback);
};

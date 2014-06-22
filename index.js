'use strict';

var fs = require('fs');
var ioctl = require('ioctl');
var WATCHDOG_FILE_NAME = "/dev/watchdog";

var WDIOC_KEEPALIVE = 2147768069;
var WDIOC_SETTIMEOUT = 3221509894;
var WDIOC_GETTIMEOUT = 2147768071;

module.exports = function(fileName) {
  var result = {
    _fd: null,
    _fileName: fileName || WATCHDOG_FILE_NAME
  };

  result._open = function(callback) {
    return fs.open(result._fileName, 'r+', function(err, fd) {
      if (err) {
        return callback(err);
      }
      result._fd = fd;
      return callback();
    });
  };

  result._ensureOpen = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    var callback = arguments[arguments.length - 1];
    if (this._fd) {
      return fn.apply(this, args);
    } else {
      return result._open(function(err) {
        if (err) {
          return callback(err);
        }
        return fn.apply(this, args);
      });
    }
  };

  result.getTimeout = result._ensureOpen.bind(result, function(callback) {
    var timeout = new Buffer(4);
    var ret = ioctl(result._fd, WDIOC_GETTIMEOUT, timeout);
    if (ret != 0) {
      return callback(new Error("ioctl failed to WDIOC_GETTIMEOUT with result: " + ret));
    }
    return callback(null, timeout.readInt32LE(0));
  });

  result.setTimeout = result._ensureOpen.bind(result, function(timeout, callback) {
    var timeoutBuffer = new Buffer(4);
    timeoutBuffer.writeInt32LE(timeout, 0);
    var ret = ioctl(result._fd, WDIOC_SETTIMEOUT, timeoutBuffer);
    if (ret != 0) {
      return callback(new Error("ioctl failed to WDIOC_SETTIMEOUT with result: " + ret));
    }
    return result.getTimeout(callback);
  });

  result.heartbeat = result._ensureOpen.bind(result, function(callback) {
    var ret = ioctl(result._fd, WDIOC_KEEPALIVE);
    if (ret != 0) {
      return callback(new Error("ioctl failed to WDIOC_KEEPALIVE with result: " + ret));
    }
    return callback(null, length.readInt32LE(0));
  });

  result.disable = result._ensureOpen.bind(result, function(callback) {
    var b = new Buffer('V');
    return fs.write(result._fd, buffer, 0, 1, 0, function(err, written, buffer) {
      if (err) {
        return callback(new Error("Could not write disable to watchdog: " + err));
      }
      if (written != 1) {
        return callback(new Error("Invalid number of bytes written to disable to watchdog. Expected 1, wrote " + written));
      }
      return callback();
    });
  });

  return result;
};

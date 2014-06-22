'use strict';

var fs = require('fs');
var ioctl = require('ioctl');
var WATCHDOG_FILE_NAME = "/dev/watchdog";

var WATCHDOG_IOCTL_BASE = 'W';
var WDIOC_KEEPALIVE = (WATCHDOG_IOCTL_BASE << 8) | 5;
var WDIOC_SETTIMEOUT = (WATCHDOG_IOCTL_BASE << 8) | 6;
var WDIOC_GETTIMEOUT = (WATCHDOG_IOCTL_BASE << 8) | 7;

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
    console.log('getTimeout ioctl', ret);
    return callback(null, length.readInt32LE(0));
  });

  result.setTimeout = result._ensureOpen.bind(result, function(callback) {
    var timeout = new Buffer(4);
    var ret = ioctl(result._fd, WDIOC_SETTIMEOUT, timeout);
    console.log('setTimeout ioctl', ret);
    return result.getTimeout(callback);
  });

  result.heartbeat = result._ensureOpen.bind(result, function(callback) {
    var ret = ioctl(result._fd, WDIOC_KEEPALIVE);
    console.log('heartbeat ioctl', ret);
    return callback(null, length.readInt32LE(0));
  });

  result.disable = result._ensureOpen.bind(result, function(callback) {
    var b = new Buffer('V');
    return fs.write(result._fd, buffer, 0, 1, 0, callback);
  });

  return result;
};

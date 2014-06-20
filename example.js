'use strict';

var piWatchdog = require('./');

console.log(piWatchdog);

piWatchdog.getTimeout(function(err, timeout) {
  console.log('getTimeout', arguments);

  piWatchdog.setTimeout(15, function(err, timeout) {
    console.log('setTimeout', arguments);

    piWatchdog.heartbeat(function(err, timeout) {
      console.log('heartbeat', arguments);

      piWatchdog.disable(function(err, timeout) {
        console.log('disable', arguments);
      });
    });
  });
});

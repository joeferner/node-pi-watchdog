'use strict';

var piWatchdog = require('./');

console.log(piWatchdog);

piWatchdog.getTimeout(function(err, timeout) {
  console.log('getTimeout', arguments);

  piWatchdog.setTimeout(15, function(err, timeout) {
    console.log('setTimeout', arguments);

    setInterval(sendHeartbeat, 5000);
  });
});

function sendHeartbeat() {
  piWatchdog.heartbeat(function(err) {
    console.log('heartbeat', arguments);
  });
}

setTimeout(function() {
  piWatchdog.disable(function(err) {
    console.log('disable', arguments);
    process.exit(0);
  });
}, 20000);

'use strict';

var piWatchdog = require('./');

console.log(piWatchdog);

console.log('getting timeout');
piWatchdog.getTimeout(function(err, timeout) {
  console.log('getTimeout', arguments);

  console.log('setting timeout');
  piWatchdog.setTimeout(15, function(err, timeout) {
    console.log('setTimeout', arguments);

    setInterval(sendHeartbeat, 5000);
  });
});

function sendHeartbeat() {
  console.log('sending heartbeat')
  piWatchdog.heartbeat(function(err) {
    console.log('heartbeat', arguments);
  });
}

setTimeout(function() {
  console.log('disabling watchdog')
  piWatchdog.disable(function(err) {
    console.log('disable', arguments);
    process.exit(0);
  });
}, 20000);

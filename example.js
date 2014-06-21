'use strict';

var readline = require('readline');
var piWatchdog = require('./');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(piWatchdog);

piWatchdog.getTimeout(function(err, timeout) {
  console.log('getTimeout', arguments);

  piWatchdog.setTimeout(15, function(err, timeout) {
    console.log('setTimeout', arguments);

    setInterval(sendHeartbeat, 5000);

    prompt();
  });
});

function sendHeartbeat() {
  piWatchdog.heartbeat(function(err, timeout) {
    console.log('heartbeat', arguments);
  });
}

function prompt() {
  rl.question("Disable Watchdog (yes/no)? ", function(answer) {
    if (answer == 'no') {
      console.log('Closing without disabling watchdog.');
      process.exit(0);
    } else {
      console.log('disabling watchdog');
      piWatchdog.disable(function(err, timeout) {
        console.log('disable', arguments);
        process.exit(0);
      });
    }
  });
}
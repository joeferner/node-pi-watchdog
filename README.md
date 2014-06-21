
pi-watchdog
===========

Node wrapper for Raspberry Pi BCM2835 Watchdog.

Getting Started
---------------

1. Install the Raspberry Pi's watchdog driver

        sudo modprobe bcm2708_wdog
        sudo nano /etc/modules (add “bcm2708_wdog”)
        
1. Install pi-watchdog

        npm install pi-watchdog
        
1. Try the example

        node node_modules/pi-watchdog/example.js

Example
-------

```
var piWatchdog = require('pi-watchdog');

piWatchdog.getTimeout(function(err, timeout) {
  console.log(timeout);
});

// enables the watchdog
piWatchdog.setTimeout(function(err, newTimeout) {
  console.log(newTimeout);
});

// send heartbeats
setInterval(sendHeartbeat, 5000);

function sendHeartbeat() {
  piWatchdog.heartbeat(function(err) {
    if(err) {
      console.log('heartbeat error', err);
    }
  });
}

// disable the watchdog
piWatchdog.disable(function(err) {
  if(err) {
    console.log('heartbeat error', err);
  }
});
```

References
----------

* http://binerry.de/post/28263824530/raspberry-pi-watchdog-timer
* https://github.com/binerry/RaspberryPi/blob/master/snippets/c/watchdog/wdt_test.c

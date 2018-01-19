'use strict';

const wd = require('./index');

/**
 * @type {PiWatchdog}
 */
const piWatchdog = wd();

console.log(piWatchdog.toString());

getWatchdogTimeout()
    .then((timeout) => {
        console.log('getTimeout', timeout);

        return setWatchdogTimeout();
    });

setTimeout(function () {
    console.log('disabling watchdog');
    piWatchdog.disable()
        .then(() => {
            console.log('disable');
            process.exit(0);
        })
        .catch(showError);
}, 20000);

function getWatchdogTimeout() {
    console.log('getting timeout');
    return piWatchdog.getTimeout()
        .then((timeout) => {
            console.log('getTimeout', timeout);

            return timeout;
        })
        .catch(showError);
}

function setWatchdogTimeout() {
    console.log('setting timeout');
    return piWatchdog.setTimeout(15)
        .then((timeout) => {
            console.log('setTimeout', timeout);

            return setInterval(sendHeartbeat, 5000);
        })
        .catch(showError);
};

function sendHeartbeat() {
    console.log('sending heartbeat');
    piWatchdog.heartbeat()
        .then(() => console.log('Heartbeat sent'))
        .catch(showError);
}

function showError(error) {
    console.log(piWatchdog.toString());
    console.error(error);
}

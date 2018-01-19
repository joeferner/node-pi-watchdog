'use strict';

const {
    WATCHDOG_GET_TIMEOUT,
    WATCHDOG_SET_TIMEOUT,
    WATCHDOG_KEEP_ALIVE,
    WATCHDOG_FILE_NAME,
    PiWatchdog
} = require('./PiWatchdog');

/**
 * Automatically generate PiWatchdog object
 *
 * @param {string} [fileName]
 * @param {number} [keepAlive]
 * @param {number} [setTimeout]
 * @param {number} [getTimeout]
 *
 * @return {PiWatchdog}
 */
function generateWatchdog(
    fileName = WATCHDOG_FILE_NAME,
    keepAlive = WATCHDOG_KEEP_ALIVE,
    setTimeout = WATCHDOG_SET_TIMEOUT,
    getTimeout = WATCHDOG_GET_TIMEOUT,
) {
    return new PiWatchdog(fileName, keepAlive, setTimeout, getTimeout);
}

module.exports = generateWatchdog;

exports.PiWatchdog = PiWatchdog;

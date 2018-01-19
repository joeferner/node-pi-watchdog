'use strict';

const WATCHDOG_FILE_NAME = require('./PiWatchdog').WATCHDOG_FILE_NAME;
const PiWatchdog = require('./PiWatchdog').PiWatchdog;

/**
 * Automatically generate PiWatchdog object
 *
 * @param {string} [fileName]
 *
 * @return {PiWatchdog}
 */
function generateWatchdog(fileName = WATCHDOG_FILE_NAME) {
    return new PiWatchdog(fileName);
}

module.exports = generateWatchdog;

exports.PiWatchdog = PiWatchdog;

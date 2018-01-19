'use strict';

const PiWatchdog = require('./PiWatchdog').PiWatchdog;

module.exports = function (fileName) {
    return new PiWatchdog(fileName);
};

exports.PiWatchdog = PiWatchdog;

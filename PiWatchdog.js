'use strict';

const fs = require('fs');
const ioctl = require('ioctl');

const WATCHDOG_FILE_NAME = exports.WATCHDOG_FILE_NAME = '/dev/watchdog';

const WATCHDOG_KEEP_ALIVE = exports.WATCHDOG_KEEP_ALIVE = 2147768069;
const WATCHDOG_SET_TIMEOUT = exports.WATCHDOG_SET_TIMEOUT = 3221509894;
const WATCHDOG_GET_TIMEOUT = exports.WATCHDOG_GET_TIMEOUT = 2147768071;

/**
 * Class for interact with linux watchdog
 */
class PiWatchdog {
    constructor(watchdogFileName, keepAlive, setTimeout, getTimeout) {
        this._keepAlive = keepAlive;
        this._setTimeout = setTimeout;
        this._getTimeout = getTimeout;
        this._fileName = watchdogFileName;
        this._fileResource = null;
    }

    /**
     * Lazy loading wrapper
     *
     * @return {Promise}
     */
    ensureOpen() {
        return new Promise((resolve, reject) => {
            if (this._fileResource) {
                return resolve();
            }

            return this.open()
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Get timeout
     *
     * @return {Promise.<number>}
     */
    getTimeout() {
        return this.ensureOpen()
            .then(() => {
                const timeout = new Buffer(4);
                const ret = ioctl(this._fileResource, this._getTimeout, timeout);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WATCHDOG_GET_TIMEOUT with result: ' + ret);
                }

                return timeout.readInt32LE(0);
            });
    }

    /**
     * Set timeout
     *
     * @param timeout
     *
     * @return {Promise.<number>}
     */
    setTimeout(timeout) {
        return this.ensureOpen()
            .then(() => {
                const timeoutBuffer = new Buffer(4);
                timeoutBuffer.writeInt32LE(timeout, 0);
                const ret = ioctl(this._fileResource, this._setTimeout, timeoutBuffer);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WATCHDOG_SET_TIMEOUT with result: ' + ret);
                }
                return timeoutBuffer.readInt32LE(0);
            });
    }

    /**
     * Make heartbeat
     *
     * @return {Promise.<void>}
     */
    heartbeat() {
        return this.ensureOpen()
            .then(() => {
                const empty = new Buffer(4);
                const ret = ioctl(this._fileResource, this._keepAlive, empty);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WATCHDOG_KEEP_ALIVE with result: ' + ret);
                }
            });
    }

    /**
     * Magic-disable watchdog
     *
     * @return {Promise.<void>}
     */
    disable() {
        return this.ensureOpen()
            .then(() => {
                /**
                 * Magic-disable character
                 *
                 * @type {Buffer}
                 */
                const disableBuffer = new Buffer('V');

                return fs.write(this._fileResource, disableBuffer, 0, 1, null, function (err, written) {
                    if (err) {
                        throw new Error('Could not write disable to watchdog: ' + err);
                    }
                    if (written !== 1) {
                        throw new Error('Invalid number of bytes written to disable to watchdog. Expected 1, wrote ' + written);
                    }
                });
            });
    }

    /**
     * Open watchdog file
     *
     * @private
     *
     * @return {Promise.<void>}
     */
    open() {
        return new Promise((resolve, reject) => {
            return fs.open(this._fileName, 'r+', (err, fileResource) => {
                if (err) {
                    return reject(err);
                }

                this._fileResource = fileResource;
                return resolve();
            });
        });
    }

    toString() {
        return this._fileName + ' - ' + (this._fileResource ? 'opened' : 'not opened');
    }
}

exports.PiWatchdog = PiWatchdog;

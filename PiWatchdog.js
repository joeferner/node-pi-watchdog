'use strict';

const fs = require('fs');
const ioctl = require('ioctl');
const WATCHDOG_FILE_NAME = '/dev/watchdog';

const WDIOC_KEEPALIVE = 2147768069;
const WDIOC_SETTIMEOUT = 3221509894;
const WDIOC_GETTIMEOUT = 2147768071;

exports.PiWatchdog = class PiWatchdog {
    constructor(watchdogFileName) {
        this._fileName = watchdogFileName || WATCHDOG_FILE_NAME;
        this._fileResource = null;
    }

    /**
     * Open watchdog file
     *
     * @private
     *
     * @return {Promise}
     */
    open() {
        return new Promise((resolve, reject) => {
            return fs.open(this._fileName._fileName, 'r+', (err, fileResource) => {
                if (err) {
                    return reject(err);
                }

                this._fileResource = fileResource;
                return resolve();
            });
        });
    }

    /**
     * Lazy loading wrapper
     *
     * @private
     *
     * @param fn
     * @return {*}
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

    getTimeout() {
        return this.ensureOpen()
            .then(() => {
                const timeout = new Buffer(4);
                const ret = ioctl(this._fileResource, WDIOC_GETTIMEOUT, timeout);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WDIOC_GETTIMEOUT with result: ' + ret);
                }

                return timeout.readInt32LE(0);
            });
    }

    setTimeout(timeout) {
        return this.ensureOpen()
            .then(() => {
                const timeoutBuffer = new Buffer(4);
                timeoutBuffer.writeInt32LE(timeout, 0);
                const ret = ioctl(this._fileResource, WDIOC_SETTIMEOUT, timeoutBuffer);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WDIOC_SETTIMEOUT with result: ' + ret);
                }
                return timeout.readInt32LE(0);
            });
    }

    heartbeat() {
        return this.ensureOpen()
            .then(() => {
                const empty = new Buffer(4);
                const ret = ioctl(this._fileResource, WDIOC_KEEPALIVE, empty);
                if (ret !== 0) {
                    throw new Error('ioctl failed to WDIOC_KEEPALIVE with result: ' + ret);
                }
            });
    }

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
};
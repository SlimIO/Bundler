"use strict";

/**
 * @namespace Utils
 */

// Require Third-party Dependencies
const getDirSize = require("get-dir-size");
const prettyBytes = require("pretty-bytes");

/**
 * @async
 * @function
 * @description Get the size in bytes of a given directory
 * @memberof Utils#
 * @param {!string} location dir location
 * @returns {Promise<string>}
 */
async function sizeOf(location) {
    const sizeInBytes = await getDirSize(location);

    return prettyBytes(sizeInBytes);
}

module.exports = {
    sizeOf
};

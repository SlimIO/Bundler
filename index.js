"use strict";

// Require Node.js Dependencies
const {
    promises: { lstat, mkdir, access },
    constants: { R_OK, W_OK }
} = require("fs");
const { join } = require("path");

// Require Third-party Dependencies
const Manifest = require("@slimio/manifest");
const prettyBytes = require("pretty-bytes");
const is = require("@slimio/is");
const nexe = require("nexe");
const tarball = require("@slimio/tarball");
const argc = require("@slimio/arg-checker");

// Require Internal Dependencies
const { sizeOf } = require("./src/utils");

/**
 * @async
 * @function generateAddonArchive
 * @description Create Addon archive
 * @param {!string} location Addon location
 * @param {object} [options] options
 * @param {boolean} [options.debug=false] enable debug (stdout size and location to TTY)
 * @param {string} [options.dest] archive destination
 * @returns {Promise<string>}
 */
async function generateAddonArchive(location, options = Object.create(null)) {
    argc(location, is.string);
    argc(options, is.plainObject);

    const { debug = false, dest = process.cwd() } = options;
    argc(debug, is.bool);
    argc(dest, is.string);

    await access(location, R_OK | W_OK);
    if (debug) {
        console.log(`${location}: original size => `, await sizeOf(location));
    }

    // Read manifest
    const man = Manifest.open(join(location, "slimio.toml"));

    const zipLocation = `Addon-${man.name}-${man.version}.tar`;
    const zipDestination = join(dest, zipLocation);
    await tarball.pack(location, zipDestination);
    if (debug) {
        const stat = await lstat(zipDestination);
        console.log(`${zipLocation}: archive compressed .zip size => `, prettyBytes(stat.size));
    }

    return zipDestination;
}


/**
 * @async
 * @function generateCoreExecutable
 * @description Bundle the core and Node.js into an executable
 * @param {!string} location Agent location
 * @param {object} [options] options
 * @param {boolean} [options.debug=false] enable debug (stdout size and location to TTY)
 * @param {string} [options.cwd] current working dir
 * @param {string | string[]} [options.targets]
 * @returns {Promise<string>}
 */
async function generateCoreExecutable(location, options = Object.create(null)) {
    argc(location, is.string);
    argc(options, is.plainObject);

    const { debug = false, cwd = process.cwd(), targets } = options;
    argc(debug, is.bool);
    argc(cwd, is.string);

    await access(location, R_OK | W_OK);
    const input = join(location, "index.js");
    if (debug) {
        console.log(`agent index.js location: ${input}`);
    }

    await mkdir(cwd, { recursive: true });
    await nexe.compile({
        input,
        output: "core",
        verbose: true,
        cwd,
        targets
    });

    return join(cwd, "core.exe");
}

module.exports = {
    generateAddonArchive,
    generateCoreExecutable
};

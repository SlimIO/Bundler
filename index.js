// Require Node.js Dependencies
const {
    promises: { access, readFile, writeFile, mkdir, copyFile, lstat },
    constants: { R_OK, W_OK }
} = require("fs");
const { join } = require("path");

// Require Third-party Dependencies
const Manifest = require("@slimio/manifest");
const ncc = require("@zeit/ncc");
const getDirSize = require("get-dir-size");
const prettyBytes = require("pretty-bytes");
const is = require("@slimio/is");
const nexe = require("nexe");
const premove = require("premove");

// Require Internal Dependencies
const createBrotliArchive = require("./src/brotli");

// CONSTANTS
const FILES_TO_COPY = new Set(["slimio.toml"]);

/**
 * @async
 * @func createArchive
 * @desc Create Addon archive
 * @param {!String} location Addon location
 * @param {Object} [options] options
 * @param {Boolean} [options.debug=false] enable debug (stdout size and location to TTY)
 * @param {String} [options.dest] archive destination
 * @returns {Promise<String>}
 *
 * @throws {TypeError}
 * @throws {Error}
 */
async function createArchive(location, options = Object.create(null)) {
    if (!is.string(location)) {
        throw new TypeError("location must be a string");
    }
    if (!is.plainObject(options)) {
        throw new TypeError("location must be a plain Object");
    }

    const { debug = false, dest = process.cwd() } = options;
    if (!is.bool(debug)) {
        throw new TypeError("debug must be a boolean");
    }

    await access(location, R_OK | W_OK);
    if (debug) {
        const bytesSize = await getDirSize(location);
        console.log(`${location}: original size =>`, prettyBytes(bytesSize));
    }

    // Generate safe path
    const manifestPath = join(location, "slimio.toml");

    // Get Package.json and SlimIO Manifest file
    const buf = await readFile(join(location, "package.json"));
    const pkg = JSON.parse(buf.toString());
    const man = Manifest.open(manifestPath);

    if (!Reflect.has(pkg, "main")) {
        throw new Error("Unable to found 'main' field in package.json");
    }

    const { code } = await ncc(join(location, pkg.main), {
        cache: false,
        externals: [],
        minify: false,
        sourceMap: false,
        sourceMapBasePrefix: "../",
        sourceMapRegister: false,
        watch: false,
        v8cache: false,
        quiet: true,
        debugLog: false
    });

    const archiveLocation = join(dest, `${man.name}-archive`);
    try {
        await mkdir(archiveLocation);
    }
    catch (err) {
        // Ignore
    }

    // Add files to archive
    await Promise.all([
        writeFile(join(archiveLocation, "index.js"), code),
        ...FILES_TO_COPY.map((file) => copyFile(manifestPath, join(archiveLocation, file)))
    ]);

    if (debug) {
        const bytesSize = await getDirSize(archiveLocation);
        console.log(`${archiveLocation}: archive (dir) size with no compression => `, prettyBytes(bytesSize));
    }

    const zipLocation = `${archiveLocation}-${pkg.version}.tar`;
    try {
        await createBrotliArchive(archiveLocation, zipLocation);
        if (debug) {
            const stat = await lstat(zipLocation);
            console.log(`${zipLocation}: archive compressed .zip size => `, prettyBytes(stat.size));
        }
    }
    finally {
        await premove(archiveLocation);
    }

    return zipLocation;
}


/**
 * @async
 * @func compileCore
 * @desc Create Agent executable
 * @param {!String} location Agent location
 * @param {Object} [options] options
 * @param {Boolean=} [options.debug=false] enable debug (stdout size and location to TTY)
 * @param {String=} [options.cwd] current working dir
 * @returns {Promise<String>}
 *
 * @throws {TypeError}
 */
async function compileCore(location, options = Object.create(null)) {
    if (!is.string(location)) {
        throw new TypeError("location must be a string");
    }
    if (!is.plainObject(options)) {
        throw new TypeError("location must be a plain Object");
    }

    const { debug = false, cwd = process.cwd() } = options;
    if (!is.bool(debug)) {
        throw new TypeError("debug must be a boolean");
    }
    if (!is.string(cwd)) {
        throw new TypeError("cwd must be a boolean");
    }

    await access(location, R_OK | W_OK);
    const input = join(location, "index.js");
    if (debug) {
        console.log(`agent index.js location: ${input}`);
    }

    await nexe.compile({
        input,
        output: "core",
        verbose: true,
        cwd,
        targets: "windows-x64-10.15.0"
    });

    return join(cwd, "core.exe");
}

module.exports = { createArchive, compileCore };


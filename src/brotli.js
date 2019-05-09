// Require Node.js Dependencies
const zlib = require("zlib");
const { join } = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const {
    createWriteStream,
    createReadStream,
    promises: { readdir, mkdir }
} = require("fs");

// Require Third-party Dependencies
const tar = require("tar-fs");

// Require Internal Dependencies
const { cleanRecursive } = require("./utils");

// Vars
const pipeAsync = promisify(pipeline);

/**
 * @func createBrotliArchive
 * @param {!String} location location
 * @param {!String} out output archive
 * @returns {Promise<void>}
 */
async function createBrotliArchive(location, out) {
    if (typeof location !== "string") {
        throw new TypeError("location must be a string");
    }
    if (typeof out !== "string") {
        throw new TypeError("out must be a string");
    }

    const tempLocation = `${location}_temp`;
    try {
        await mkdir(tempLocation);
    }
    catch (err) {
        // Ignore
    }

    try {
        const files = await readdir(location);

        // eslint-disable-next-line
        const streamPromises = files.map((file) => {
            return pipeAsync(
                createReadStream(join(location, file)),
                zlib.createBrotliCompress(),
                createWriteStream(join(tempLocation, file))
            );
        });
        await Promise.all(streamPromises);

        await pipeAsync(
            tar.pack(tempLocation), createWriteStream(out)
        );
    }
    catch (err) {
        await cleanRecursive(tempLocation);

        throw err;
    }
    finally {
        await cleanRecursive(tempLocation);
    }
}

module.exports = createBrotliArchive;

/**
 * @namespace Utils
 */

// Require Node.js Dependencies
const { join } = require("path");
const { readdir, rmdir, unlink, lstat } = require("fs").promises;

/**
 * @async
 * @func cleanRecursive
 * @memberof Utils#
 * @param {!String} location location
 * @returns {Promise<void>}
 */
async function cleanRecursive(location) {
    const st = await lstat(location);
    if (st.isDirectory()) {
        const files = await readdir(location);

        // eslint-disable-next-line
        await Promise.all(files.map((file) => {
            return cleanRecursive(join(location, file));
        }));

        return rmdir(location);
    }

    return unlink(location);
}

module.exports = { cleanRecursive };

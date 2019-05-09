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
const { yellow } = require("kleur");
const { zip } = require("zip-a-folder");

/**
 * @async
 * @func createArchive
 * @param {!String} location Addon location
 * @returns {Promise<void>}
 */
async function createArchive(location) {
    await access(location, R_OK | W_OK);
    const locationSize = await getDirSize(location);
    console.log("Original size: ", yellow(prettyBytes(locationSize)));

    const packagePath = join(location, "package.json");
    const manifestPath = join(location, "slimio.toml");

    // Get Package.json and SlimIO Manifest file
    const buf = await readFile(packagePath);
    const pkg = JSON.parse(buf.toString());
    const man = Manifest.open(manifestPath);

    if (!Reflect.has(pkg, "main")) {
        throw new Error("Unable to found 'main' field in package.json");
    }

    const { code } = await ncc(join(location, pkg.main), {
        cache: false,
        externals: [],
        minify: true,
        sourceMap: false,
        sourceMapBasePrefix: "../",
        sourceMapRegister: true,
        watch: false,
        v8cache: false,
        quiet: false,
        debugLog: false
    });

    const archiveLocation = join(process.cwd(), `${man.name}-archive`);
    try {
        await mkdir(archiveLocation);
    }
    catch (err) {
        // Ignore
    }

    // Add files to archive
    await Promise.all([
        writeFile(join(archiveLocation, "index.js"), code),
        copyFile(packagePath, join(archiveLocation, "package.json")),
        copyFile(manifestPath, join(archiveLocation, "slimio.toml"))
    ]);

    const archiveSize = await getDirSize(archiveLocation);
    console.log("Archive size (no compression): ", yellow(prettyBytes(archiveSize)));

    const zipLocation = `${archiveLocation}.zip`;
    await zip(archiveLocation, zipLocation);

    const zipSize = await lstat(zipLocation);
    console.log("Archive size (zipped): ", yellow(prettyBytes(zipSize.size)));
}

module.exports = { createArchive };


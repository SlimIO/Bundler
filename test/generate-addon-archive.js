"use strict";

// Require Node.js Dependencies
const { join } = require("path");
const { access, unlink } = require("fs").promises;

// Require Internal Dependencies
const { generateAddonArchive } = require("../index");

// CONSTANTS
const FIXTURES = join(__dirname, "fixtures");

test("create an archive for fixtures/cpu", async() => {
    const tarLocation = await generateAddonArchive(join(FIXTURES, "cpu"), { dest: __dirname });

    expect(tarLocation).toStrictEqual(join(__dirname, "Addon-cpu-1.0.0.tar"));
    try {
        await access(tarLocation);
    }
    finally {
        await unlink(tarLocation);
    }
});

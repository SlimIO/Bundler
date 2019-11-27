"use strict";

// Require Node.js Dependencies
const { join } = require("path");

// Require Internal Dependencies
const { sizeOf } = require("../src/utils");

// CONSTANTS
const FIXTURES = join(__dirname, "fixtures");

test("sizeof of fixtures", async() => {
    const tSize = await sizeOf(FIXTURES);

    expect(typeof tSize).toStrictEqual("string");
    expect(/^[0-9]+\s{1}[\w]+$/g.test(tSize)).toBe(true);
});

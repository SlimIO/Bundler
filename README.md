# bundler
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/bundler/master/package.json?token=AOgWw3vrgQuu-U4fz1c7yYZyc7XJPNtrks5catjdwA%3D%3D&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/bundler/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/SlimIO/bundler)
![size](https://img.shields.io/github/languages/code-size/SlimIO/bundler)
[![Known Vulnerabilities](https://snyk.io//test/github/SlimIO/bundler/badge.svg?targetFile=package.json)](https://snyk.io//test/github/SlimIO/bundler?targetFile=package.json)
[![Build Status](https://travis-ci.com/SlimIO/Bundler.svg?branch=master)](https://travis-ci.com/SlimIO/Bundler) [![Greenkeeper badge](https://badges.greenkeeper.io/SlimIO/Bundler.svg)](https://greenkeeper.io/)

SlimIO Archive bundler & Core compiler.

## Requirements
- [Node.js](https://nodejs.org/en/) v12 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/bundler
# or
$ yarn add @slimio/bundler
```

## Usage example
TBC

## API

<details><summary>generateAddonArchive(location: string, options?: ArchiveOptions): Promise< string ></summary>
<br />

Create Addon archive.

```js
const { generateAddonArchive } = require("@slimio/bundler");

generateAddonArchive("F:\\Code\\Agent\\addons\\alerting", {
    debug: true
}).catch(console.error);
```

</details>

<details><summary>generateCoreExecutable(location: string, options?: CoreOptions): Promise< string ></summary>
<br />

Compile the core. Options is described by the following interface
```ts
interface CoreOptions {
    debug?: boolean;
    cwd?: string;
}
```

```js
const { generateCoreExecutable } = require("@slimio/bundler");
const { join } = require("path");

generateCoreExecutable("F:\\Code\\AgentTest", {
        debug: true,
        cwd: join(__dirname, "build")
    });
}).then(() => console.log("core compiled")).catch(console.error);
```

</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/arg-checker](https://github.com/SlimIO/bundler)|Minor|Low|Argument Checker|
|[@slimio/is](https://github.com/SlimIO/is#readme)|Minor|Low|Type checker|
|[@slimio/manifest](https://github.com/SlimIO/Manifester#readme)|Minor|Low|SlimIO manifest|
|[@slimio/tarball](https://github.com/SlimIO/Tarball)|⚠️Major|High|SlimIO Addon & module archive tarball packer/extractor|
|[get-dir-size](https://github.com/fraxken/dir-size#readme)|Minor|Low|Get a directory size|
|[nexe](https://github.com/nexe/nexe#readme)|⚠️Major|High|Create Node.js executable|
|[pretty-bytes](https://github.com/sindresorhus/pretty-bytes#readme)|Minor|Low|Displaying file sizes for humans|

## License
MIT

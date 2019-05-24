# bundler
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

SlimIO Archive (Addon & Core) Bundler

## Requirements
- Node.js v10 or higher

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

<details><summary>createArchive(location: string, options?: ArchiveOptions): Promise< string ></summary>
<br />

Create Addon archive.

```js
const { createArchive } = require("./index");

createArchive("F:\\Code\\Agent\\addons\\alerting", {
    debug: true
}).catch(console.error);
```

</details>

<details><summary>compileCore(location: string, options?: CoreOptions): Promise< string ></summary>
<br />

Compile the core. Options is described by the following interface
```ts
interface CoreOptions {
    debug?: boolean;
    cwd?: string;
}
```

```js
const { compileCore } = require("./index");
const { mkdir } = require("fs").promises;
const { join } = require("path");

async function main() {
    const cwd = join(__dirname, "build");

    await mkdir(cwd);
    await compileCore("F:\\Code\\AgentTest", {
        debug: true, cwd
    });
}
main().catch(console.error);
```

</details>

## License
MIT

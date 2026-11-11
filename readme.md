<!-- title -->

# @kitschpatrol/tweakpane-plugin-file-import

<!-- /title -->

<!-- badges({ npmDownloads: true }) -->

[![NPM Package @kitschpatrol/tweakpane-plugin-file-import](https://img.shields.io/npm/v/@kitschpatrol/tweakpane-plugin-file-import.svg)](https://www.npmjs.com/package/@kitschpatrol/tweakpane-plugin-file-import)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)
[![CI](https://github.com/kitschpatrol/tweakpane-plugin-file-import/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/tweakpane-plugin-file-import/actions/workflows/ci.yml)
[![NPM Downloads @kitschpatrol/tweakpane-plugin-file-import](https://img.shields.io/npm/dm/@kitschpatrol/tweakpane-plugin-file-import)](https://www.npmjs.com/package/@kitschpatrol/tweakpane-plugin-file-import)

<!-- /badges -->

<!-- description -->

**Fork of tweakpane-plugin-file-import with build optimizations.**

<!-- /description -->

## Overview

A file input for Tweakpane 4, forked from [Luís Arteiro's tweakpane-plugin-file-import](https://github.com/LuchoTurtle/tweakpane-plugin-file-import). It supports file selection, drag and drop, extension filters, and clearing the selected file.

The [upstream README](https://github.com/LuchoTurtle/tweakpane-plugin-file-import#readme) describes the plugin's features and options. This fork is maintained primarily for [Svelte Tweakpane UI](https://kitschpatrol.com/svelte-tweakpane-ui).

## Fork changes

- Publishes as `@kitschpatrol/tweakpane-plugin-file-import` instead of `tweakpane-plugin-file-import`.
- Bundles `@tweakpane/core` at the package root like a standard Tweakpane plugin, and adds a `/lite` entry that imports core instead so bundlers can share one copy across plugins.
- Exports public parameter types from the package root and `/lite`.
- Builds TypeScript and inline SCSS with tsdown, with a Vite playground, Vitest tests, ksc linting, and chagent release notes.
- Clears the drag state even when drop processing throws.

## Getting started

<!-- dependencies({ headingLevel: 3 }) -->

### Dependencies

- [Node.js](https://nodejs.org/) 18.0.0 or newer
- [tweakpane](https://www.npmjs.com/package/tweakpane) `^4.0.0` _(peer dependency)_

<!-- /dependencies -->

<!-- install({ headingLevel: 3 }) -->

### Installation

Add it to your project:

```sh
npm install @kitschpatrol/tweakpane-plugin-file-import
```

<!-- /install -->

## Usage

```ts
import * as FileImportPlugin from '@kitschpatrol/tweakpane-plugin-file-import'
import { Pane } from 'tweakpane'

const pane = new Pane()
pane.registerPlugin(FileImportPlugin)

const parameters = { file: '' }
pane.addBinding(parameters, 'file', {
  filetypes: ['.png', '.jpg'],
  lineCount: 3,
  view: 'file-input',
})
```

See the [upstream usage documentation](https://github.com/LuchoTurtle/tweakpane-plugin-file-import#usage) for the remaining options. To share core through your bundler, import `@kitschpatrol/tweakpane-plugin-file-import/lite` instead.

## Distribution

The build writes four ES module files directly under `dist/`:

| File                                       | Core     | Minified |
| ------------------------------------------ | -------- | -------- |
| `tweakpane-plugin-file-import.js`          | Bundled  | No       |
| `tweakpane-plugin-file-import.min.js`      | Bundled  | Yes      |
| `tweakpane-plugin-file-import.lite.js`     | External | No       |
| `tweakpane-plugin-file-import.lite.min.js` | External | Yes      |

The package root resolves to `.js` and bundles `@tweakpane/core`. The `/lite` entry resolves to `.lite.js` and imports core, so an application bundler can share one copy across plugins. Direct URL imports of a lite file need an import map for core. Tweakpane itself is a peer dependency and is never bundled. Use one entry consistently when relying on the identity of exported classes.

Both entries share the `dist/tweakpane-plugin-file-import.d.ts` declarations, so import public types from the package root or `/lite`. The export map contains only the package root, `/lite`, and `/package.json`. JavaScript targets ES2022, and no source maps are emitted.

<!-- size-table({ files: ["dist/tweakpane-plugin-file-import.js", "dist/tweakpane-plugin-file-import.min.js", "dist/tweakpane-plugin-file-import.lite.js", "dist/tweakpane-plugin-file-import.lite.min.js"], precision: 1 }) -->

| File                                     | Original | Gzip   | Brotli |
| ---------------------------------------- | -------- | ------ | ------ |
| tweakpane-plugin-file-import.js          | 14.5 kB  | 4.1 kB | 3.5 kB |
| tweakpane-plugin-file-import.min.js      | 8.2 kB   | 2.7 kB | 2.3 kB |
| tweakpane-plugin-file-import.lite.js     | 9.8 kB   | 2.9 kB | 2.4 kB |
| tweakpane-plugin-file-import.lite.min.js | 6.7 kB   | 2.1 kB | 1.8 kB |

<!-- /size-table -->

## Development

<!-- development-dependencies({ headingLevel: 3 }) -->

### Development dependencies

- [Node.js](https://nodejs.org/) ^24.16.0 || >=26.3.0
- [pnpm](https://pnpm.io/) 12.16.1

<!-- /development-dependencies -->

| Command        | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `pnpm install` | Install development dependencies.                                       |
| `pnpm build`   | Build the four distributions and the declaration bundle with tsdown.    |
| `pnpm dev`     | Open the Vite playground in `demo/index.html`.                          |
| `pnpm watch`   | Rebuild JavaScript, declarations, and imported Sass partials on change. |
| `pnpm test`    | Run the Vitest suite in `test/`.                                        |
| `pnpm fix`     | Apply ksc formatting and lint fixes.                                    |
| `pnpm lint`    | Check code, types, styles, dependencies, and generated documentation.   |

Styles live in `src/styles/` and compile to a CSS string through an `?inline` import, which Tweakpane installs when the plugin is registered. Build before running `pnpm fix` or `pnpm lint`, since mdat reads `dist/` for the size table.

The release script calls chagent to update the changelog while preparing the version bump, then builds and publishes the package.

## Versioning

In addition to the `/lite` entry, this fork also includes dependency updates. In an effort to stay in sync with future upstream versions, release version numbers are tagged with a "fork" suffix and an incrementing number.

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/tweakpane-plugin-file-import/issues) are welcome and appreciated.

Please open an issue to discuss changes before submitting a pull request. Unsolicited PRs (especially AI-generated ones) are unlikely to be merged.

This repository uses [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) (via its `ksc` CLI) for linting and formatting, plus [MDAT](https://github.com/kitschpatrol/mdat) for readme placeholder expansion.

<!-- /contributing -->

<!-- license -->

## License

[MIT](license.txt) © Luís Arteiro

<!-- /license -->

Original template contributions: [MIT](license.txt) © [cocopon](https://github.com/cocopon).

Fork modifications: [MIT](license.txt) © [Eric Mika](https://ericmika.com).

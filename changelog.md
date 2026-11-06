# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Breaking:** Publish the fork under the scoped package name `@kitschpatrol/tweakpane-plugin-file-import`.
- **Breaking:** Externalize `@tweakpane/core` as a runtime dependency requiring `^2.0.5`; direct browser imports now need an import map.
- **Breaking:** Declare Node.js 18+ as a package installation requirement.

### Fixed

- Emit declarations under the package's `dist/types` directory and set the source root so the advertised TypeScript entry point is included.

### Documentation

- Document the fork, external dependency/import-map setup, `-fork.N` versioning, and upstream and fork license attribution.

### Maintenance

- Refresh development dependencies, including TypeScript 6 and ESLint 10, update pnpm to 12.16.1, remove obsolete tooling, and declare contributor Node.js requirements.
- Use pnpm/shx task scripts and Rollup watch mode, recompiling inlined CSS when Sass sources or imports change.
- Add missing `tslib`, configure pnpm native builds, and generate and validate README metadata with mdat.
- Replace upstream CI and Dependabot with release/metadata workflows, scheduled link checks, and weekly upstream fork synchronization.
- Switch releases to bumpp with fork suffixes, require tests/builds before publishing, and update npm authentication to use one-time passwords.
- Correct the package repository URL and update author and maintainer metadata.

## [1.2.0] - 2026-02-24

### Fixed

- Declare `type: module` to match the package's existing ES module output.

### Maintenance

- Refresh development dependencies, including ESLint 10 and Rollup 4, and replace the legacy Terser plugin with `@rollup/plugin-terser`.
- Modernize Sass compilation and TypeScript module resolution, target ES2017, update asset scripts for ESM, and add dependency overrides for build warnings.
- Update CI actions and test on Node.js 20, 22, 24, and the latest release, removing Node.js 18 from the tooling matrix.

## [1.2.0-fork.1] - 2026-10-15

### Documentation

- Document `-fork.N` release versioning, refresh reference links, and add upstream and fork license attribution.

### Maintenance

- Refresh development dependencies to TypeScript 6, ESLint 10, and pnpm 12, remove obsolete tooling, and declare contributor Node.js requirements.
- Modernize Sass and TypeScript build configuration, target ES2017, set the declaration source root, and add missing `tslib` and pnpm native-build configuration.
- Replace npm-run-all/onchange/rimraf tasks with pnpm, shx, and Rollup watch mode, rebuilding inlined CSS when Sass sources or imports change.
- Add mdat README generation and validation, and run tests and builds before publishing fork releases.
- Add scheduled repository/homepage link checks and upstream fork synchronization, and refresh release/metadata workflows with pinned actions.
- Correct the package repository URL and update author and maintainer metadata.

## [1.1.2-beta.2] - 2025-03-04

### Changed

- Remove the pnpm engine restriction from package installation.

### Maintenance

- Update the runtime requirement for `@tweakpane/core` to `^2.0.5`.
- Declare missing ESLint configuration dependencies, refresh development tooling, and update the project package manager to pnpm 10.
- Publish releases with npm's `latest` tag and update the release and repository-metadata workflows.

## [1.1.2-beta.1] - 2024-10-22

### Changed

- **Breaking:** Publish the fork as `@kitschpatrol/tweakpane-plugin-file-import` and explicitly declare it as an ES module package.
- **Breaking:** Externalize `@tweakpane/core` as a runtime dependency requiring `^2.0.4`; direct browser imports now need an import map.
- **Breaking:** Declare Node.js 18+ and pnpm 9+ engine requirements.

### Fixed

- Emit TypeScript declarations inside the package's `dist/types` directory so the declared type entry point is included.

### Documentation

- Explain the fork's dependency externalization and versioning, and update the browser example to use import maps.

### Maintenance

- Adopt pnpm and refresh development dependencies, including Rollup 4 and the official `@rollup/plugin-terser` minifier.
- Replace upstream CI and Dependabot configuration with GitHub release/metadata workflows and switch the release command to bumpp.

## [1.1.1] - 2024-09-13

### Documentation

- Add an initial `npm run build:dev` step to the contributor preview instructions.

### Maintenance

- Migrate to ESLint 9 flat configuration, update lint/format commands, and refresh TypeScript, build, formatting, and release dependencies.
- Remove Node.js 16 from CI because the updated ESLint tooling requires a newer Node.js version.

## [1.1.0] - 2024-05-31

### Added

- Allow custom invalid-filetype warnings through `invalidFiletypeMessage`, preserving the configured message across selections and deletions.

### Documentation

- Document the custom warning option and update the legacy Tweakpane 3 installation example.

## [1.0.2] - 2024-05-09

### Added

- Show invalid-filetype warnings for five seconds and highlight the drop area while dragging.

### Changed

- **Breaking:** Require Tweakpane 4 and migrate registration and bindings to its plugin bundle API, including `id`/`css` exports and `addBinding` usage.
- **Breaking:** Distribute ES modules instead of UMD bundles, requiring module imports for browser usage.

### Fixed

- Fix file selection on iOS Safari by using a persistent native file input.
- Apply `filetypes` validation to dropped files and configure native file dialogs with the allowed extensions.

### Documentation

- Add Tweakpane 4 usage examples and compatibility guidance for users remaining on Tweakpane 3.
- Correct the contributor startup command to `npm start` and document the Node.js 16+ tooling requirement.

### Maintenance

- Refresh TypeScript, linting, formatting, and Rollup dependencies, remove unused test tooling, and restore the release-it command.
- Enable weekly Dependabot updates and update CI to check Node.js 16, 18, 20, and the latest release.
- Start a local browser preview server alongside source watching with `npm start`.
- Refactor controller/view responsibilities and remove native event listeners when the control is disposed.

## [0.1.4] - 2023-07-17

### Documentation

- Correct browser registration to use `TweakpaneFileImportPlugin` and align the module import examples.

## [0.1.3] - 2023-06-21

### Maintenance

- Correct the package homepage to point to the project's GitHub repository.

## [0.1.2] - 2023-06-12

### Documentation

- Correct the npm badge link to point to the published package.

### Maintenance

- Add homepage and Git repository metadata to the package manifest.

## [0.1.1] - 2023-06-03

### Documentation

- Expand npm/CDN installation, parameter, and contributor guidance, and correct plugin registration in the browser test example.

### Maintenance

- Add GitHub Actions build and lint checks for pushes and pull requests across Node.js 14, 16, 18, and 20.
- Refresh ESLint, TypeScript ESLint, Prettier integration, and import-sorting dependencies.

## [0.1.0] - 2023-06-03

### Added

- Provide a Tweakpane 3 `file-input` binding through the exported `plugins` array, initialized with an empty string and emitting browser `File` selections.
- Support single-file drag and drop, display selected filenames, and clear selections to `null` with a Delete button.
- Expose `lineCount` to configure control height, defaulting to three lines, and `filetypes` to validate extensions selected through the file picker.
- Distribute `tweakpane-plugin-file-import` through npm with standard and minified UMD builds exposing the `TweakpaneFileImportPlugin` browser global.

### Documentation

- Document browser and package registration, file-input configuration, and handling selection change events.

### Maintenance

- Establish TypeScript/Rollup builds, Sass compilation, linting, formatting, watch commands, and release-it tooling.

[Unreleased]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.2.0...HEAD
[0.1.0]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/releases/tag/0.1.0
[0.1.1]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/0.1.0...0.1.1
[0.1.2]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/0.1.1...0.1.2
[0.1.3]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/0.1.2...0.1.3
[0.1.4]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/0.1.3...0.1.4
[1.0.2]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/0.1.4...1.0.2
[1.1.0]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.0.2...1.1.0
[1.1.1]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.1.0...1.1.1
[1.1.2-beta.1]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.1.1...1.1.2-beta.1
[1.1.2-beta.2]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.1.2-beta.1...1.1.2-beta.2
[1.2.0-fork.1]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.1.2-beta.2...1.2.0-fork.1
[1.2.0]: https://github.com/kitschpatrol/tweakpane-plugin-file-import/compare/1.1.1...1.2.0

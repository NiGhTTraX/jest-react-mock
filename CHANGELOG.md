# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.3.0](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.1.2...v3.3.0) (2026-01-27)


### Features

* Support jest 30 ([652a96c](https://github.com/NiGhTTraX/jest-react-mock/commit/652a96c1400fe937c4ac48ea03cf9f77f2d3acc4))
* Support react-mock-component v4 ([d780a75](https://github.com/NiGhTTraX/jest-react-mock/commit/d780a75a8c6f986b62710c405ae18d8b3f5e0476))

## [3.2.0](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.1.2...v3.2.0) (2025-03-02)


### Features

* Support react-mock-component v4 ([d780a75](https://github.com/NiGhTTraX/jest-react-mock/commit/d780a75a8c6f986b62710c405ae18d8b3f5e0476))

### [3.1.2](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.1.1...v3.1.2) (2022-11-01)

### Features

* Widen peer deps to include jest 29 ([8df0cf2](https://github.com/NiGhTTraX/jest-react-mock/commit/8df0cf29b5328b372932713a295f2ebb2367f4d4))

### [3.1.1](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.1.0...v3.1.1) (2022-07-17)


### Bug Fixes

* Widen peer deps to include jest 28 ([263d1c9](https://github.com/NiGhTTraX/jest-react-mock/commit/263d1c982877780d497050198fd1e5c34c6e5630))

## [3.1.0](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.0.1...v3.1.0) (2021-08-26)


### Features

* Add optional times argument to `toHaveBeenRendered` ([d4d4274](https://github.com/NiGhTTraX/jest-react-mock/commit/d4d4274e77d52fc27fbd099b2a51c68475f6173c))

### [3.0.1](https://github.com/NiGhTTraX/jest-react-mock/compare/v3.0.0...v3.0.1) (2021-07-16)

## [3.0.0](https://github.com/NiGhTTraX/jest-react-mock/compare/v2.0.0...v3.0.0) (2021-07-16)


### ⚠ BREAKING CHANGES

* Node 10 is no longer supported.

### Bug Fixes

* Force TS to emit types ([f439afc](https://github.com/NiGhTTraX/jest-react-mock/commit/f439afcb9abb022bc8c65af35190c40d7c8e827f))


### build

* Use node 12 ([6793173](https://github.com/NiGhTTraX/jest-react-mock/commit/67931732fff3bf3a426ea4e1c6fefd3359b95ea4))

### [2.0.1](https://github.com/NiGhTTraX/jest-react-mock/compare/v2.0.0...v2.0.1) (2021-02-21)


### Bug Fixes

* Force TS to emit types ([98f7c4d](https://github.com/NiGhTTraX/jest-react-mock/commit/98f7c4d6dcaa93abb949282e99da533c6dd13555))

## [2.0.0](https://github.com/NiGhTTraX/jest-react-mock/compare/v1.0.0...v2.0.0) (2021-02-21)


### ⚠ BREAKING CHANGES

* you no longer have to run `expect.extend()` yourself,
just import the package in your test setup.

### Features

* Add `toHaveProps` ([442cb5e](https://github.com/NiGhTTraX/jest-react-mock/commit/442cb5e96b8775d728382437705063d03033a730))
* Add IDE integration for diffing last props ([e50b1e9](https://github.com/NiGhTTraX/jest-react-mock/commit/e50b1e904677c277ffdfa3e90d7f50e09113ad78))
* Improve error messages ([e077ea0](https://github.com/NiGhTTraX/jest-react-mock/commit/e077ea0e9039e335ba502d00133147c3102dde7b))
* Improve error messages for partial props ([5553fa5](https://github.com/NiGhTTraX/jest-react-mock/commit/5553fa5487a7bc1c39c2fa5512da4660cda9e2b8))
* Improve error messages when only one render ([50b1ec6](https://github.com/NiGhTTraX/jest-react-mock/commit/50b1ec696bbafe6fda4b6cda72735fcdd791eb58))
* Print nice diff for `toHaveProps` ([4291e0f](https://github.com/NiGhTTraX/jest-react-mock/commit/4291e0f62053da8a25285ffbe7ccda5bc3dcd5da))


### Bug Fixes

* Check mounted status, not render, for `toBeMounted` ([b3aa149](https://github.com/NiGhTTraX/jest-react-mock/commit/b3aa149cba01611f881f0ba1347b05d7fc4c1fb2))
* Only check last props for `toHaveProps` ([82180df](https://github.com/NiGhTTraX/jest-react-mock/commit/82180dfd4e06c1ed8b12084b78126cef31dc7079))
* Support partial nesting in `toHaveProps` ([aeb9804](https://github.com/NiGhTTraX/jest-react-mock/commit/aeb980452b5f3b949310684bc39e2cc663f0d4c5))


* Automatically install matcher ([7fd3c09](https://github.com/NiGhTTraX/jest-react-mock/commit/7fd3c094c2bfcd710293c33e3e3967c88c63799c))

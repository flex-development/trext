# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/flex-development/trext/compare/trext@2.0.0...trext@2.0.1) (2021-10-30)


### :bug: Fixes

* **cjs:** missing named exports ([e3466b7](https://github.com/flex-development/trext/commit/e3466b713e342ac7b491f2753310a5ecdd171168))

## [2.0.0](https://github.com/flex-development/trext/compare/trext@1.1.0...trext@2.0.0) (2021-10-30)


### ⚠ BREAKING CHANGES

* import `RegexString` from `@flex-development/tutils`

### :recycle: Code Improvements

* import `RegexString` from `@flex-development/tutils` ([763a305](https://github.com/flex-development/trext/commit/763a30542fbcb6c634baa50add0029ab99a49b09))


### :sparkles: Features

* `TrextOptions#absolute` ([7ee867a](https://github.com/flex-development/trext/commit/7ee867ac7890d40e325a5e701186dd730063e0e7))


### :truck: Continuous Integration & Deployment

* **workflows:** temporarily skip dependency graph check ([bbeae54](https://github.com/flex-development/trext/commit/bbeae54f1f0a0b305aeb3893d5df955bbecf93d7))


### :pencil2: Housekeeping

* **scripts:** add `check:ci` script ([93af4df](https://github.com/flex-development/trext/commit/93af4dfc36e0a2d85689577cebaf66ac79eb6793))
* **tools:** cleanup esm loader ([d4f10f6](https://github.com/flex-development/trext/commit/d4f10f699b3751e53cbaf26816eca9945a0220cd))
* **tools:** reorganize build workflow ([5774ac3](https://github.com/flex-development/trext/commit/5774ac33cfc0c7759328d4a28c73d4d0b28b8728))
* **tools:** use explicit environment variables in testing workflow ([f436d3d](https://github.com/flex-development/trext/commit/f436d3d4edb4dba085fe29d2185e9c9351c15766))
* **typescript:** add typings for `@vercel/ncc` ([82acbbc](https://github.com/flex-development/trext/commit/82acbbca51ac6e8da1704e57a5fb55abfb2ed3fa))
* **typescript:** add typings for `tsc-prog/dist/utils/log` ([ffa44cf](https://github.com/flex-development/trext/commit/ffa44cf4da7ad5e166fb7192862f49ef7e187147))

## [1.1.0](https://github.com/flex-development/trext/compare/trext@1.0.2...trext@1.1.0) (2021-10-15)


### :truck: Continuous Integration & Deployment

* **workflows:** add `delete-release-branch` job ([804c006](https://github.com/flex-development/trext/commit/804c00622ba9734ed9177a9941bc4b25a908b8f3))
* **workflows:** push to protected branch 'main' ([a03238c](https://github.com/flex-development/trext/commit/a03238c84113788b5fd84bd731f162492c09a587))


### :robot: Testing

* **plugins:** add fully specified directory index tests ([2115bd8](https://github.com/flex-development/trext/commit/2115bd8b901c898bb319f9ef69b73db3eaa6a551))


### :hammer: Build

* **cjs:** enable downleveling ([01a41ec](https://github.com/flex-development/trext/commit/01a41ecad5e879195b9cfb9eb53ca5ebc32ce8c9))
* **typescript:** add sourcemaps for `.d.ts` files ([ed57233](https://github.com/flex-development/trext/commit/ed57233cd3f5d1a1e89c4cff1262c3a26a1e0db0))


### :pencil2: Housekeeping

* **tools:** drop `fixImportPaths` ([ff9ac19](https://github.com/flex-development/trext/commit/ff9ac19e9cfdbb7def399472ec64826e51451584))
* **tools:** reimplement `loadenv` in cjs format ([4d1f246](https://github.com/flex-development/trext/commit/4d1f2468142480d99d5f8dd207b0a2403a68972e))
* **tools:** remove `useModuleExports` from build workflow ([4c22aa9](https://github.com/flex-development/trext/commit/4c22aa921099abb99e6a947e4b67f4db2f47687e))
* **typescript:** add note about disabling `noUnusedLocals` ([1a5c030](https://github.com/flex-development/trext/commit/1a5c030e1fcf8ca4cffa019294ae8aea552f0a04))
* **typescript:** enable `exactOptionalPropertyTypes` ([708bc4d](https://github.com/flex-development/trext/commit/708bc4d00e05eb4e2050877ddd341e0b815758f3))
* **typescript:** enable `noErrorTruncation` ([f92b160](https://github.com/flex-development/trext/commit/f92b160ed029efe49326c88cbcaabb0818cdf0b0))
* **typescript:** enable `noPropertyAccessFromIndexSignature` ([832051d](https://github.com/flex-development/trext/commit/832051da0b8ec298d4c8a40e4aea72bee2d9fad9))
* **typescript:** enable `noUncheckedIndexedAccess` ([aa95c2d](https://github.com/flex-development/trext/commit/aa95c2d4b2d732bf4dd2d7a4c77d2fc02b2752ba))
* **typescript:** upgrade to typescript@4.5.0-beta ([7e9d04e](https://github.com/flex-development/trext/commit/7e9d04e5eef3fa3b224bcf69adb220ccbe09b089))


### :sparkles: Features

* transform export declarations ([#5](https://github.com/flex-development/trext/issues/5)) ([f937db0](https://github.com/flex-development/trext/commit/f937db042a4f6611636dad64d1b91e8439ea3161))

### [1.0.2](https://github.com/flex-development/trext/compare/trext@1.0.1...trext@1.0.2) (2021-10-13)


### :bug: Fixes

* `require is not defined in ES module scope` ([bd718de](https://github.com/flex-development/trext/commit/bd718de092a57051ef67527cfba9853bef9a5418)), closes [#issuecomment-942454663](https://github.com/flex-development/trext/issues/issuecomment-942454663)

### [1.0.1](https://github.com/flex-development/trext/compare/trext@1.0.0...trext@1.0.1) (2021-10-13)


### :pencil2: Housekeeping

* **tools:** add `ts-patch`, drop `ttypescript` ([7c38efc](https://github.com/flex-development/trext/commit/7c38efc692f46475968615dfd01725e0cc030f21))
* **tools:** add `tsc-prog` to build workflow ([a14fd44](https://github.com/flex-development/trext/commit/a14fd445c80d5e8b035411a37492245dad2ddbe2))


### :bug: Fixes

* ignore directory indexes ([#2](https://github.com/flex-development/trext/issues/2)) ([3313025](https://github.com/flex-development/trext/commit/3313025188ad91a7d1181ca21464aec01558274a))

## 1.0.0 (2021-10-10)


### :nail_care: Formatting & Structure

* drop `unicorn/prefer-at` rule ([9384aec](https://github.com/flex-development/trext/commit/9384aec28a1dbcdf4760f19f8fc31cb6758b0554))


### :sparkles: Features

* `TREXT_DEFAULTS` ([189490e](https://github.com/flex-development/trext/commit/189490e06a21cb27ab001a2231bf7102fc4958b2))
* **plugins:** `Trext` ([61acbde](https://github.com/flex-development/trext/commit/61acbde02b8f7f25eb5c4326f522543ef4a3d233))
* **plugins:** `Trextel` ([7451cde](https://github.com/flex-development/trext/commit/7451cdee077d22044c3b026c886b2800733ac234))
* **typescript:** `FileExtension` ([98f8e5b](https://github.com/flex-development/trext/commit/98f8e5bb2bd3131ce2a7a3aef1ccb608de384d17))
* **typescript:** `RegexString` ([0303124](https://github.com/flex-development/trext/commit/0303124cabf65680405b3666765fa05d5f301778))
* **typescript:** `SourceMapComment` ([f3a7c17](https://github.com/flex-development/trext/commit/f3a7c17c4129bed386523f653edde3ce50859aee))
* **typescript:** `TrextDefaults` ([d747581](https://github.com/flex-development/trext/commit/d747581ac7bbefcf30062ab5a41d865d2a7cdbe0))
* **typescript:** `TrextFileResult` ([4c155ab](https://github.com/flex-development/trext/commit/4c155ab0a898c18b9b14b6285fd2261d1209e53d))
* **typescript:** `TrextMatch` ([8cdaaf0](https://github.com/flex-development/trext/commit/8cdaaf05e87a96da23906b56af51eaf3095ade04))
* **typescript:** `TrextOptions` ([3689a74](https://github.com/flex-development/trext/commit/3689a74aa22a88c22b990d8d4378e3717f6935a3))
* **typescript:** `TrextTo` ([b2b180d](https://github.com/flex-development/trext/commit/b2b180d8cd59405bc9aed2c3a28e9aebf483a232))
* **typescript:** `TrextToFn` ([a266d77](https://github.com/flex-development/trext/commit/a266d77009bb7eb8650a61a073906931e4427794))
* **utils:** `addSourceMap` ([3983348](https://github.com/flex-development/trext/commit/3983348e03e499a399f75596b7ce3012b828f831))
* **utils:** `glob` ([55b7c33](https://github.com/flex-development/trext/commit/55b7c334ce9d731f1364942ca763e7dffd9eaf8e))
* **utils:** `ignore404` ([acee839](https://github.com/flex-development/trext/commit/acee839af5b53c98c45a02f439ca74a3f77297ac))
* **utils:** `saveFile` ([dca9764](https://github.com/flex-development/trext/commit/dca97641e60994b90a59d730a2e3f4ef0cca3933))
* **utils:** `sourceMappingURL` ([9119cc1](https://github.com/flex-development/trext/commit/9119cc17dd71e59b78b4d6a821d69d5066e46703))


### :hammer: Build

* add `./plugins` and `./plugins/*` exports ([d7f32a4](https://github.com/flex-development/trext/commit/d7f32a48237410bfbb457861cf758627dac22f9d))
* add `./utils` and `./utils/*` exports ([07b3d30](https://github.com/flex-development/trext/commit/07b3d309272c0e2439d379262b3b95c7ca968fef))
* add `types` to build artifacts ([3c5a258](https://github.com/flex-development/trext/commit/3c5a258dc553d284c6eb63675b94f84df29041d2))


### :book: Documentation

* add usage guide ([047cac8](https://github.com/flex-development/trext/commit/047cac8e3cc0f3620986adc2b9cb64202a8fcacc))
* fix link to install guide ([28ef66d](https://github.com/flex-development/trext/commit/28ef66dfb4bf69d4c6ad27248f1f0f553da6b8fa))
* update "Getting Started" and "Inspired By" sections ([ef6b6e0](https://github.com/flex-development/trext/commit/ef6b6e0a0358fc4d89bd6aee217eddb8efe90792))
* update `TrextOptions#pattern` description ([dfa2611](https://github.com/flex-development/trext/commit/dfa26118465a714fe99fe612a347f073fb1a5471))
* update `TrextOptions` description ([2fa11a8](https://github.com/flex-development/trext/commit/2fa11a86895f1b8840a73aa229394c36c5384d37))
* update project description ([1322a0f](https://github.com/flex-development/trext/commit/1322a0f248459c2b74b0b324a1d2883ed2f36673))


### :pencil2: Housekeeping

* first commit ([84e8d07](https://github.com/flex-development/trext/commit/84e8d07b2d961d0982ae7362567f24b945727ec8))
* **github:** add `plugins` commit scope ([820e4d0](https://github.com/flex-development/trext/commit/820e4d05855c2eca499754c08b4843cb0cf7c4b5))
* **github:** add `scope:plugins` label ([8479a56](https://github.com/flex-development/trext/commit/8479a56d14560c20d28b5a355bbe7086a69ba6e3))
* **github:** add `scope:utils` label ([7dc928f](https://github.com/flex-development/trext/commit/7dc928f5cefedcbd5446a73c5666482890783c91))
* **github:** add `utils` commit scope ([2595e15](https://github.com/flex-development/trext/commit/2595e153015b0438dd2b639c4d17cb922d671759))
* local ci check ([d969287](https://github.com/flex-development/trext/commit/d96928792a9f7cbbc5b6e7020b1334ba27ed307d))
* local integrity check ([5cd4768](https://github.com/flex-development/trext/commit/5cd47682a24eaae92a305e57fa7849d87bd42b1b))
* **tools:** fix `cannot find module ../loaders/env.cjs` ([edd1eb2](https://github.com/flex-development/trext/commit/edd1eb2f99fd9ef78834d4d925b47903981aa836))
* **tools:** fix typo in `scripts/jest.sh` ([1ad80b2](https://github.com/flex-development/trext/commit/1ad80b2950e3a45bc981c2f9ebd268cf2a6c3045))
* update package keywords ([1949965](https://github.com/flex-development/trext/commit/194996535c49f848b017db90666f46528aff5579))
* update package keywords ([3d9be81](https://github.com/flex-development/trext/commit/3d9be81478deac861260b4bcaf400cdbf7a859b1))


### :truck: Continuous Integration & Deployment

* **workflows:** fix `cannot find module ../loaders/env.cjs` ([f2dd2eb](https://github.com/flex-development/trext/commit/f2dd2ebff7ed3469f2921409fccd1ff699125d63))

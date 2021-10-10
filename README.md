# :sparkles: trext

File extension transformer

[![LICENSE](https://img.shields.io/github/license/flex-development/loadenv.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://www.typescriptlang.org)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Overview

[Getting Started](#getting-started)  
[Usage](#usage)  
[Usage](#usage)  
[Built With](#built-with)  
[Inspired By](#inspired-by)  
[Contributing](CONTRIBUTING.md)

## Getting Started

Interested in using `.cjs` and `.mjs` file extensions, but _not_ in setting up
another build workflow? Use `trext` to transform file extensions, import
statements, call expressions, and even source map comments!

## Installation

```zsh
yarn add -D @flex-development/trext # or npm i -D @flex-development/trext
```

## Usage

### Programmatic

**TODO**: Update documentation.

## Built With

- [@babel/core][1] - Babel compiler core
- [@babel/traverse][2] - Traverse and update nodes
- [glob][3] - Match file paths using glob patterns
- [mkdirp][4] - Node.js implementation of `mkdir -p`

## Inspired By

### [convert-extension][5]

The `trext` library is heavily inspired by `convert-extension`, but intends to
allow for a more configurable user experience. Unlike `convert-extension`,
`trext` allow maintainers to specify custom file extension search patterns and
dynamically generate file extensions.

[1]: https://github.com/babel/babel/tree/main/packages/babel-core
[2]: https://github.com/babel/babel/tree/main/packages/babel-traverse
[3]: https://github.com/isaacs/node-glob
[4]: https://github.com/isaacs/node-mkdirp
[5]: https://github.com/peterjwest/convert-extension

# :gear: trext

File extension transformer

[![LICENSE](https://img.shields.io/github/license/flex-development/loadenv.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![TypeScript](https://badgen.net/badge/-/typescript?icon=typescript&label)](https://www.typescriptlang.org)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Overview

[Getting Started](#getting-started)  
[Installation](#installation)  
[Usage](#usage)  
[Built With](#built-with)  
[Contributing](CONTRIBUTING.md)

## Getting Started

Interested in using `.cjs` and `.mjs` file extensions, but _not_ in setting up
another build workflow? Use `trext` to transform file extensions, import
statements, call expressions, and even source maps!

Heavily inspired by [`convert-extension`][5], `trext` intends to provide a more
configurable user experience. In addition to passing custom
[Babel transform](#babel-transform) options, maintainers can also specify custom
[file extension search patterns](#file-extension-search-patterns) and use
functions to [dynamically generate extensions](#dynamic-file-extensions).

## Installation

```zsh
yarn add -D @flex-development/trext # or npm i -D @flex-development/trext
```

## Usage

### Basic Usage

Running the example script below will convert any `.js` files and their relative
imports to use `.mjs` extensions.

```typescript
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'util'

/**
 * @file Examples - Basic Usage
 * @module docs/examples/basic
 */

const TREXT_OPTIONS: TrextOptions<'js', 'mjs'> = {
  from: 'js',
  to: 'mjs'
}

trext('esm', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))
```

### Advanced Usage

#### Babel Transform

`trext` implements a [custom Babel plugin][6] to update `import` and `require`
statements. If enabled, source maps will also be updated. You can specify
additional transform options using the `babel` property:

```typescript
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'util'

/**
 * @file Examples - Babel Transform Options
 * @module docs/examples/babel
 */

const TREXT_OPTIONS: TrextOptions<'js', 'cjs'> = {
  babel: { comments: false, minified: true, sourceMaps: 'inline' as const },
  from: 'js',
  to: 'cjs'
}

trext('cjs/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))
```

#### Dynamic File Extensions

`trext` uses the [`String.prototype.replace`][7] method to replace file
extensions. The `to` option can also be specifed as a function to take full
advantage of the method's capabilities. When using a function, however, note
that **the function will also be invoked within the context of [`Trextel`][6],
thus drastically changing the arguments passed to your function**:

```typescript
import type { NodePath } from '@babel/traverse'
import type { CallExpression, ImportDeclaration } from '@babel/types'
import { isNode } from '@babel/types'
import type {
  FileExtension,
  TrextMatch,
  TrextOptions
} from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'util'

/**
 * @file Examples - Dynamic File Extensions
 * @module docs/examples/dynamic
 */

const TREXT_OPTIONS: TrextOptions<'js', 'cjs' | 'mjs'> = {
  babel: { comments: false, minified: true, sourceMaps: 'inline' as const },
  from: 'js',
  to(match: TrextMatch, ...args: any[]): FileExtension<'cjs' | 'mjs'> {
    // Check if match is NodePath, args === []
    if (isNode((match as any).node)) {
      const nodePath = match as NodePath<CallExpression | ImportDeclaration>

      if (nodePath.type === 'CallExpression') {
        //
      }

      return '.mjs'
    }

    // Check is match is RegExp object
    if (match.constructor.name === 'RegExp') {
      const regex = match as RegExp

      // do something!
    }

    // typeof match === 'string'
    const substring = match as string

    return '.cjs'
  }
}

trext('build/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))
```

#### File Extension Search Patterns

If your naming convention includes dots (e.g: `.interface.js`), you'll want to
specify a custom file extension search `pattern`:

```typescript
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'util'

/**
 * @file Examples - Custom File Extension Search Pattern
 * @module docs/examples/pattern
 */

const TREXT_OPTIONS: TrextOptions<'js', 'mjs'> = {
  from: 'js',
  pattern: /.js$/,
  to: 'mjs'
}

trext('esm/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))
```

## Built With

- [@babel/core][1] - Babel compiler core
- [@babel/traverse][2] - Traverse and update nodes
- [glob][3] - Match file paths using glob patterns
- [mkdirp][4] - Node.js implementation of `mkdir -p`

[1]: https://github.com/babel/babel/tree/main/packages/babel-core
[2]: https://github.com/babel/babel/tree/main/packages/babel-traverse
[3]: https://github.com/isaacs/node-glob
[4]: https://github.com/isaacs/node-mkdirp
[5]: https://github.com/peterjwest/convert-extension
[6]: src/plugins/trextel.plugin.ts
[7]:
  https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace

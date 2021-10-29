import { isNode } from '@babel/types'
import {
  FileExtension,
  trext,
  TrextMatch,
  TrextNodePath,
  TrextOptions
} from '@flex-development/trext'
import Trextel from '@flex-development/trext/plugins/trextel.plugin'
import { inspect } from 'node:util'

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
      const nodePath = match as TrextNodePath
      const code: string | undefined = Trextel.getCode(nodePath)

      switch (nodePath.type) {
        case 'CallExpression':
          //
          break
        case 'ExportAllDeclaration':
          //
          break
        case 'ExportNamedDeclaration':
          //
          break
        case 'ImportDeclaration':
          //
          break
        default:
          break
      }

      return '.mjs'
    }

    // Check if match is RegExp object
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

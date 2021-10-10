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

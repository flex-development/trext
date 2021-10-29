import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'node:util'

/**
 * @file Examples - Ignoring Directory Indexes
 * @module docs/examples/src
 */

const TREXT_OPTIONS: TrextOptions<'js', 'cjs'> = {
  from: 'js',
  pattern: /.js$/,
  src: 'lib',
  to: 'cjs'
}

trext('cjs/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))

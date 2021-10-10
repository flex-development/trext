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

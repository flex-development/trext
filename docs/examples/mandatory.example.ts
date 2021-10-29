import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'node:util'

/**
 * @file Examples - Disabling Mandatory File Extensions
 * @module docs/examples/mandatory
 */

const TREXT_OPTIONS: TrextOptions<'js', 'mjs'> = {
  from: 'js',
  mandatory: false,
  pattern: /.js$/,
  to: 'mjs'
}

trext('esm/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))

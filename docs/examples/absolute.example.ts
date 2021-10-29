import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'node:util'

/**
 * @file Examples - Absolute Imports
 * @module docs/examples/absolute
 */

const TREXT_OPTIONS: TrextOptions<'js', 'mjs'> = {
  absolute: /@flex-development/,
  from: 'js',
  to: 'mjs'
}

trext('esm/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))

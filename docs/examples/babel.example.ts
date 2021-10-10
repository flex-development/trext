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

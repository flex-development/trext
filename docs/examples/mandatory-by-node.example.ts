import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import { inspect } from 'node:util'

/**
 * @file Examples - Disabling Mandatory File Extensions (By Node)
 * @module docs/examples/mandatory-by-node
 */

const TREXT_OPTIONS: TrextOptions<'js', 'mjs'> = {
  from: 'js',
  mandatory: {
    call: false,
    exportAll: true,
    exportNamed: false,
    import: true
  },
  pattern: /.js$/,
  to: 'mjs'
}

trext('mjs/', TREXT_OPTIONS)
  .then(results => console.info(inspect(results, false, null)))
  .catch(error => console.error(inspect(error, false, null)))

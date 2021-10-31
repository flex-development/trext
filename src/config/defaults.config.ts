import type { TrextDefaults } from '@trext/types'

/**
 * @file Configuration - Default Options
 * @module trext/config/defaults
 */

const DEFAULTS: TrextDefaults = {
  absolute: false,
  babel: {},
  direxts: ['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx'],
  mandatory: true,
  pattern: /\..+$/,
  src: `${process.cwd()}/src`
}

export default DEFAULTS

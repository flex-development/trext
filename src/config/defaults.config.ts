import type { TrextDefaults } from '@trext/types'

/**
 * @file Configuration - Default Options
 * @module trext/config/defaults
 */

const DEFAULTS: TrextDefaults = {
  absolute: false,
  babel: {},
  mandatory: true,
  pattern: /\..+$/,
  src: `${process.cwd()}/src`
}

export default DEFAULTS

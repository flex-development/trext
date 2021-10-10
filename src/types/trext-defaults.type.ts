import type { TrextOptions } from '@trext/interfaces'

/**
 * @file Type Definitions - TrextDefaults
 * @module trext/types/TrextDefaults
 */

/**
 * Default `trext` options.
 */
type TrextDefaults = {
  /** {@link TrextOptions#babel} */
  babel: Partial<Record<keyof NonNullable<TrextOptions['babel']>, never>>

  /** {@link TrextOptions#pattern} */
  pattern: Exclude<NonNullable<TrextOptions['pattern']>, string>
}

export default TrextDefaults

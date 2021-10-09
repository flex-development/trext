import type { TrextOptions } from '@trext/interfaces'

/**
 * @file Type Definitions - TrextDefaults
 * @module trext/types/TrextDefaults
 */

/**
 * Default `trext` options.
 */
type TrextDefaults = {
  /** {@link TrextOptions.pattern} */
  pattern: Exclude<NonNullable<TrextOptions['pattern']>, string>

  /** {@link TrextOptions.transform} */
  transform: Record<string, never>
}

export default TrextDefaults

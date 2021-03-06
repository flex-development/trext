import type { TrextOptions } from '@trext/interfaces'

/**
 * @file Type Definitions - TrextDefaults
 * @module trext/types/TrextDefaults
 */

/**
 * Default `trext` options.
 */
type TrextDefaults = {
  /** {@link TrextOptions#absolute} */
  absolute: Extract<NonNullable<TrextOptions['absolute']>, false>

  /** {@link TrextOptions#babel} */
  babel: Partial<Record<keyof NonNullable<TrextOptions['babel']>, never>>

  /** {@link TrextOptions#direxts} */
  direxts: ['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx']

  /** {@link TrextOptions#mandatory} */
  mandatory: Extract<NonNullable<TrextOptions['mandatory']>, true>

  /** {@link TrextOptions#pattern} */
  pattern: Exclude<NonNullable<TrextOptions['pattern']>, string>

  /** {@link TrextOptions#src} */
  src: string
}

export default TrextDefaults

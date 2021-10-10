import type { BabelFileResult } from '@babel/core'
import type { File } from '@babel/types'

/**
 * @file Type Definitions - TrextFileResult
 * @module trext/types/TrextFileResult
 */

/**
 * Return value of `Trext.trextFile`.
 *
 * ! Note: For some reason, `@babel/core` does not export the [`FileResult`][1]
 * ! type (nor is it correctly defined in the repository). Additionally, [types
 * ! needed to correctly implement this type are also not available][2].
 *
 * @template T - File extension name(s)
 *
 * [1]: https://github.com/babel/babel/blob/v7.15.8/packages/babel-core/src/transformation/index.ts
 * [2]: https://github.com/babel/babel/blob/v7.15.8/packages/babel-core/src/config/validation/options.ts
 */
type TrextFileResult = {
  ast: File | null
  code: string | null
  ignored?: NonNullable<BabelFileResult['ignored']>
  map: NonNullable<BabelFileResult['map']>
  metadata: Record<never, never> | NonNullable<BabelFileResult['metadata']>

  /**
   * ! `@babel/core` library does not export `InputOptions` type either.
   *
   * @see https://github.com/babel/babel/blob/c4b13725aa65446974d8b78b63a7da8ec826ff76/packages/babel-core/src/config/validation/options.ts#L132
   */
  options?: Record<string, any>
  sourceType: 'module' | 'string'
}

export default TrextFileResult

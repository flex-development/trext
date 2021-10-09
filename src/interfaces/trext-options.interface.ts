import type { TransformOptions } from '@babel/core'
import type { TrextTo } from '@trext/types'

/**
 * @file Interfaces - TrextOptions
 * @module trext/interfaces/TrextOptions
 */

/**
 * Options to configure file extension and import statement transformations.
 *
 * @template F - Old file extension name(s)
 * @template T - New file extension name(s)
 */
interface TrextOptions<F extends string = string, T extends string = string> {
  /**
   * File extension to transform.
   */
  from: F

  /**
   * File extension search pattern.
   *
   * @default /\..+$/
   */
  pattern?: RegExp | string

  /**
   * Babel transformation options.
   *
   * @default {}
   */
  transform?: TransformOptions

  /**
   * New file extension or function that returns a file extension.
   *
   * @see {@link TrextTo}
   */
  to: TrextTo<T>
}

export default TrextOptions

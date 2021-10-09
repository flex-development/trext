import type { TransformOptions } from '@babel/core'
import type { FileExtension, TrextToFn } from '@trext/types'

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
   * New file extension or [function that returns new file extension][1].
   *
   * If the value is a string, a period (`.`) will be prepended to coerce the
   * value into a valid file extension.
   *
   * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
   */
  to: FileExtension<T> | TrextToFn<T>
}

export default TrextOptions

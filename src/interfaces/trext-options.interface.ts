import type { TransformOptions } from '@babel/core'

/**
 * @file Interfaces - TrextOptions
 * @module trext/interfaces/TrextOptions
 */

/**
 * Options to configure file extension and import statement transformations.
 */
interface TrextOptions {
  /**
   * File extension to transform.
   */
  from: string

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
   * If the value is a string and doesn't start with a period (`.`), one will be
   * prepended to coerce the value into a valid file extension.
   *
   * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
   */
  to: string | ((match: string, ...args: any[]) => string)
}

export default TrextOptions

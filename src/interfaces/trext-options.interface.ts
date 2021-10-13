import type { TransformOptions } from '@babel/core'
import type { RegexString, TrextTo } from '@trext/types'

/**
 * @file Interfaces - TrextOptions
 * @module trext/interfaces/TrextOptions
 */

/**
 * Options to configure file extension transformations.
 *
 * @template F - Old file extension name(s)
 * @template T - New file extension name(s)
 */
interface TrextOptions<F extends string = string, T extends string = string> {
  /**
   * Babel transformation options.
   *
   * @default {}
   */
  babel?: TransformOptions

  /**
   * File extension to transform.
   */
  from: F

  /**
   * File extension search pattern.
   *
   * @default /\..+$/
   */
  pattern?: RegexString

  /**
   * Directory where source files are located.
   *
   * Used to identify and ignore `import` and `require` statements that include
   * directory entry points without a specifier or a `/index` suffix (i.e: `from
   * './types'`, where `./types/index.*` is the file being imported).
   *
   * @default `${process.cwd()}/src`
   */
  src?: string

  /**
   * New file extension or function that returns a file extension.
   *
   * @see {@link TrextTo}
   */
  to: TrextTo<T>
}

export default TrextOptions

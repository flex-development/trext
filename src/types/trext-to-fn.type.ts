import type FileExtension from './file-extension.type'
import type RegexString from './regex-string.type'

/**
 * @file Type Definitions - TrextToFn
 * @module trext/types/TrextToFn
 */

/**
 * [Function that returns a file extension][1].
 *
 * @template T - File extension name(s)
 *
 * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
 */
type TrextToFn<T extends string = string> = (
  match: RegexString,
  ...args: any[]
) => FileExtension<T>

export default TrextToFn

import type TrextToFn from './trext-to-fn.type'

/**
 * @file Type Definitions - TrextTo
 * @module trext/types/TrextTo
 */

/**
 * New file extension or [function that returns a file extension][1].
 *
 * String values will have a period (`.`) prepended to coerce the values into a
 * valid file extension.
 *
 * @template T - New file extension name(s)
 *
 * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
 */
type TrextTo<T extends string = string> = string | TrextToFn<T>

export default TrextTo

import type FileExtension from './file-extension.type'
import type TrextMatch from './trext-match.type'

/**
 * @file Type Definitions - TrextToFn
 * @module trext/types/TrextToFn
 */

/**
 * Function that returns a file extension.
 *
 * The exact number of arguments passed depends on the context in which the
 * function was invoked, and then on if the first argument is a `RegExp` object.
 *
 * See [Specifying a function as a parameter][1] from MDN documentation for
 * arguments passed when using `String.prototype.replace`.
 *
 * When used within `Trextel`, our custom Babel plugin, the only argument passed
 * will be a type of {@link NodePath} object:
 *
 * -  `NodePath<CallExpression>`
 * -  `NodePath<ImportDeclaration>`
 *
 * @template T - File extension name(s)
 *
 * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
 */
type TrextToFn<T extends string = string> = {
  (match: TrextMatch, ...args: any[]): FileExtension<T>
}

export default TrextToFn

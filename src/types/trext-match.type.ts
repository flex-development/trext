import type { RegexString } from '@flex-development/tutils'
import type TrextNodePath from './trext-node-path.type'

/**
 * @file Type Definitions - TrextMatch
 * @module trext/types/TrextMatch
 */

/**
 * The matched substring when [replacing a file extension][1], or when used
 * within `Trextel`, our custom Babel plugin, a type of `NodePath` object:
 *
 * -  `NodePath<CallExpression>`
 * -  `NodePath<ExportAllDeclaration>`
 * -  `NodePath<ExportNamedDeclaration>`
 * -  `NodePath<ImportDeclaration>`
 *
 * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
 */
type TrextMatch = RegexString | TrextNodePath

export default TrextMatch

import type { NodePath } from '@babel/core'
import type { CallExpression, ImportDeclaration } from '@babel/types'
import type RegexString from './regex-string.type'

/**
 * @file Type Definitions - TrextMatch
 * @module trext/types/TrextMatch
 */

/**
 * The matched substring when [replacing a file extension][1], or when used
 * within `Trextel`, a custom Babel plugin, a type of {@link NodePath} object:
 *
 * -  `NodePath<CallExpression>`; see {@link CallExpression}
 * -  `NodePath<ImportDeclaration>`; see {@link ImportDeclaration}
 *
 * [1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter
 */
type TrextMatch = RegexString | NodePath<CallExpression | ImportDeclaration>

export default TrextMatch

import type { NodePath } from '@babel/core'
import type { CallExpression, ImportDeclaration } from '@babel/types'

/**
 * @file Type Definitions - TrextNodePath
 * @module trext/types/TrextNodePath
 */

/**
 * {@link NodePath} objects used by `Trextel`, our [custom Babel plugin][1].
 *
 * - See {@link CallExpression}
 * - See {@link ImportDeclaration}
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
type TrextNodePath = NodePath<CallExpression | ImportDeclaration>

export default TrextNodePath

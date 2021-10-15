import type {
  CallExpression,
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration
} from '@babel/types'

/**
 * @file Type Definitions - TrextNode
 * @module trext/types/TrextNode
 */

/**
 * `NodePath#node` objects handled by `Trextel`, our [custom Babel plugin][1].
 *
 * - See {@link CallExpression}
 * - See {@link ExportAllDeclaration}
 * - See {@link ExportNamedDeclaration}
 * - See {@link ImportDeclaration}
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
type TrextNode =
  | CallExpression
  | ExportAllDeclaration
  | ExportNamedDeclaration
  | ImportDeclaration

export default TrextNode

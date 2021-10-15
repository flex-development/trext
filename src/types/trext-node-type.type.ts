import type { NodePath } from '@babel/core'
import type TrextNode from './trext-node.type'

/**
 * @file Type Definitions - TrextNodeType
 * @module trext/types/TrextNodeType
 */

/**
 * Names of `NodePath#node` objects handled by `Trextel`, our [custom Babel
 * plugin][1].
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
type TrextNodeType = NodePath<TrextNode>['type']

export default TrextNodeType

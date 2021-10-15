import type { NodePath } from '@babel/core'
import type TrextNode from './trext-node.type'

/**
 * @file Type Definitions - TrextNodePath
 * @module trext/types/TrextNodePath
 */

/**
 * {@link NodePath} objects used by `Trextel`, our [custom Babel plugin][1].
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
type TrextNodePath = NodePath<TrextNode>

export default TrextNodePath

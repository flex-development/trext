import type { IOptions } from 'glob'
import globSync from 'glob'
import { promisify } from 'util'

/**
 * @file Utilities - glob
 * @module trext/utils/glob
 */

/**
 * Asynchronous implementation of [`glob`][1].
 *
 * [1]: https://github.com/isaacs/node-glob
 *
 * @async
 * @param {string} pattern - File pattern
 * @param {IOptions} [options={}] - `globSync` options
 * @return {Promise<string[]>} Array of filenames where name matches `pattern`
 */
const glob = async (
  pattern: string,
  options: IOptions = {}
): Promise<string[]> => promisify(globSync)(pattern, options)

export default glob

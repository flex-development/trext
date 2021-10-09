import { SourceMapComment } from '@trext/types'
import path from 'path'

/**
 * @file Utilities - sourceMappingURL
 * @module trext/utils/sourceMappingURL
 */

/**
 * Returns a source map comment.
 *
 * @param {string} filename - Name of source file
 * @param {string} [ext] - Extension to remove
 * @return {SourceMapComment} Comment referencing a source map
 */
const sourceMappingURL = (filename: string, ext?: string): SourceMapComment => {
  return `//# sourceMappingURL=${path.basename(filename, ext)}`
}

export default sourceMappingURL

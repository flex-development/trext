/**
 * @file Type Definitions - SourceMapComment
 * @module trext/types/SourceMapComment
 */

/**
 * String representing a comment referencing a source map.
 *
 * @template T - File extension name(s)
 */
type SourceMapComment = `//# sourceMappingURL=${string}`

export default SourceMapComment

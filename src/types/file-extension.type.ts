/**
 * @file Type Definitions - FileExtension
 * @module trext/types/FileExtension
 */

/**
 * String representing a file extension.
 *
 * @template T - File extension name(s)
 */
type FileExtension<T extends string = string> = `.${T}`

export default FileExtension

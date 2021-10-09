import replace from 'replace-in-file'

/**
 * @file Helpers - useDualExports
 * @module tools/helpers/useDualExports
 */

/**
 * Export both CommonJS and ES Modules in TypeScript.
 *
 * @see https://remarkablemark.org/blog/2020/05/05/typescript-export-commonjs-es6-modules/
 *
 * @param {string | string[]} [files=[]] - Files to perform replacements on
 * @return {import('replace-in-file').ReplaceResult[]} Replacement results
 */
const useDualExports = (files = []) => {
  return replace.sync({
    files,
    from: new RegExp('exports.default = ', 'g'),

    /**
     * Replaces `exports.default` statements with the original statement and
     * their CommonJS equivalent, `module.exports`.
     *
     * @param {string} match - The matched substring
     * @param {number} offset - Offset of `match` within `content` context
     * @param {string} content - File content
     * @return {string} `exports.default` and `module.exports` statements
     */
    // @ts-expect-error Type not assignable to type 'ToCallback'.
    // Reason: `ToCallback` definition missing `content` parameter 🙄
    to(match, offset, content) {
      const section = content.slice(offset)

      const exports_default = section.split('//#')[0]
      const module_exports = 'module.exports = '

      if (section.includes(module_exports)) return match
      return `${exports_default}\n${module_exports}`
    }
  })
}

export default useDualExports

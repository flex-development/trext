import type { ReplaceResult } from 'replace-in-file'
import replace from 'replace-in-file'

/**
 * @file Helpers - useModuleExports
 * @module tools/helpers/useModuleExports
 */

/**
 * Replaces `exports.default` statements with a CommonJS equivalent.
 *
 * @param {string | string[]} [files=[]] - Files to perform replacements on
 * @param {boolean} [dryRun=false] - Skip replacement
 * @return {ReplaceResult[]} Replacement results
 */
const useModuleExports = (
  files: string[] | string = [],
  dryRun: boolean = false
): ReplaceResult[] => {
  return replace.sync({
    files: dryRun ? [] : files,
    from: new RegExp('exports.default =', 'g'),
    to: 'module.exports ='
  })
}

export default useModuleExports

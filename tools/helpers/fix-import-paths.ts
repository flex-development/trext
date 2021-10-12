import logger from '@flex-development/grease/utils/logger.util'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { ReplaceResult } from 'replace-in-file'
import replace from 'replace-in-file'

/**
 * @file Helpers - fixImportPaths
 * @module tools/helpers/fixImportPaths
 */

/**
 * When using [TypeScript path mapping][1], path aliases are interpreted exactly
 * as written. This function fixes all import paths that match either of the
 * following regex patterns:
 *
 * - `/(../.*)?node_modules/g`
 * - `/@packages/g`
 *
 * @see https://github.com/adamreisnz/replace-in-file
 *
 * [1]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
 *
 * @param {string} [message] - Success log message
 * @param {any[]} [args=[]] - Success log arguments
 * @return {ReplaceResult[]} Replacement results
 */
const fixImportPaths = (
  message?: string,
  args: any[] = []
): ReplaceResult[] => {
  let results: ReplaceResult[] = []

  try {
    results = replace.sync({
      files: ['./cjs/**/*', './esm/**/*', './types/**/*'],
      from: new RegExp(`(../.*)?${process.env.NODE_MODULES}/`),
      to: ''
    })
  } catch (error) {
    logger({}, (error as Error).message, [], LogLevel.ERROR)
  }

  if (message) logger({}, message, args)
  return results
}

export default fixImportPaths

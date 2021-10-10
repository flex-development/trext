import { TrextOptions } from '@trext/interfaces'
import { TrextFileResult } from '@trext/types'
import fs from 'fs/promises'
import path from 'path'
import ignore404 from './ignore-404.util'
import saveFile from './save-file.util'
import sourceMappingURL from './source-mapping-url.util'

/**
 * @file Utilities - addSourceMap
 * @module trext/utils/addSourceMap
 */

/**
 * Adds a `SourceMap` comment to `result.code` if source maps are enabled.
 *
 * @template F - Old file extension name(s)
 * @template T - New file extension name(s)
 *
 * @async
 * @param {TrextOptions<F, T>} options - Trext options
 * @param {TrextFileResult} result - File transformation result
 * @param {{input:string;output:string}} filenames - Filenames map
 * @return {Promise<TrextFileResult>} File transformation result
 */
async function addSourceMap<
  F extends string = string,
  T extends string = string
>(
  options: TrextOptions<F, T>,
  result: TrextFileResult,
  filenames: Record<'input' | 'output', string>
): Promise<TrextFileResult> {
  // Do nothing if source maps aren't enabled
  if (!(result.map && options.babel?.sourceMaps)) return result

  // Get source map filename
  const filename = `${filenames.output}.map`

  // Add source map comment and update source map filename
  result.code = `${result.code}\n${sourceMappingURL(filename)}\n`
  result.map.file = path.basename(filenames.output)

  // Save source map and remove references to old source map
  if (options.babel.sourceMaps !== 'inline') {
    await saveFile(filename, JSON.stringify(result.map))
    await ignore404(fs.unlink(`${filenames.input}.map`))
  }

  return result
}

export default addSourceMap

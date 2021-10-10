import { transformFileAsync, TransformOptions } from '@babel/core'
import DEFAULTS from '@trext/config/defaults.config'
import { TrextOptions } from '@trext/interfaces'
import Trextel from '@trext/plugins/trextel.plugin'
import type {
  TrextFileResult,
  TrextTo as To,
  TrextToFn as ToFn
} from '@trext/types'
import { RegexString } from '@trext/types'
import addSourceMap from '@trext/utils/add-source-map.util'
import glob from '@trext/utils/glob.util'
import saveFile from '@trext/utils/save-file.util'
import fs from 'fs/promises'

/**
 * @file Plugins - Trext
 * @module trext/plugins/Trext
 */

/**
 * File extension and import statement transformer.
 */
class Trext {
  /**
   * Executes `trextFile` over a directory.
   *
   * @see {@link Trext.trextFile}
   *
   * @template F - Old file extension name(s)
   * @template T - New file extension name(s)
   *
   * @async
   * @param {string} cwd - Directory to perform transformation
   * @param {TrextOptions<F, T>} options - Trext options
   * @param {TransformOptions} [options.babel={}] - Babel transform options
   * @param {F} options.from - File extension to transform
   * @param {RegexString} [options.pattern=/\..+$/] - File extension pattern
   * @param {To<T>} options.to - New file extension or generator function
   * @return {Promise<TrextFileResult[]>} Transformation results
   */
  static async trext<F extends string = string, T extends string = string>(
    cwd: string,
    options: TrextOptions<F, T>
  ): Promise<TrextFileResult[]> {
    // Get files to transform
    const filenames = await glob(`${cwd}/**/*.${options.from}`)

    // Transform files
    const results = filenames.map(async f => Trext.trextFile<F, T>(f, options))

    // Return transformation results
    return await Promise.all(results)
  }

  /**
   * Transforms a file's extension, import statements, call expressions, and
   * source map comment.
   *
   * @template F - Old file extension name(s)
   * @template T - New file extension name(s)
   *
   * @async
   * @param {string} filename - Name of file to transform
   * @param {TrextOptions<F, T>} options - Trext options
   * @param {TransformOptions} [options.babel={}] - Babel transform options
   * @param {F} options.from - File extension to transform
   * @param {RegexString} [options.pattern=/\..+$/] - File extension pattern
   * @param {To<T>} options.to - New file extension or generator function
   * @return {Promise<TrextFileResult>} Transformation result
   * @throws {Error}
   */
  static async trextFile<F extends string = string, T extends string = string>(
    filename: string,
    options: TrextOptions<F, T>
  ): Promise<TrextFileResult> {
    // Merge user options with defaults
    const opts = { ...DEFAULTS, ...options }
    const { babel, pattern, to } = opts

    // Transform file
    let result = (await transformFileAsync(filename, {
      ...Object.assign({}, { ...DEFAULTS.babel, ...babel }),
      caller: { name: '@babel/cli' },
      plugins: [[new Trextel().plugin, opts], ...(babel?.plugins ?? [])]
    })) as TrextFileResult | null

    // Throw error if result is missing
    if (!result) throw new Error(`Could not compile file ${filename}`)

    // Get output filename
    // @ts-expect-error No overload matches this call
    const output = filename.replace(pattern, (to as ToFn).call ? to : `.${to}`)

    // Stringify source code
    result.code = String(result.code)

    // Handle source map
    result = await addSourceMap(opts, result, { input: filename, output })

    // Save file, update file permissions, and remove references to old file
    await saveFile(output, result.code as string)
    await fs.chmod(output, (await fs.stat(filename)).mode)
    await fs.unlink(filename)

    return result
  }
}

export const trext = Trext.trext
export const trextFile = Trext.trextFile

export default Trext

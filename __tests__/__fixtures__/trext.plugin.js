import { transformFileAsync } from '@babel/core';
import fs from 'fs/promises';
import DEFAULTS from "../config/defaults.config.mjs";
import addSourceMap from "../utils/add-source-map.util.mjs";
import glob from "../utils/glob.util.mjs";
import saveFile from "../utils/save-file.util.mjs";
import Trextel from "./trextel.plugin.mjs";
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
  static async trext(cwd, options) {
    // Get files to transform
    const filenames = await glob(`${cwd}/**/*.${options.from}`); // Transform files

    const results = filenames.map(async f => Trext.trextFile(f, options)); // Return transformation results

    return await Promise.all(results);
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


  static async trextFile(filename, options) {
    // Merge user options with defaults
    const opts = { ...DEFAULTS,
      ...options
    };
    const {
      babel,
      pattern,
      to
    } = opts; // Transform file

    let result = await transformFileAsync(filename, { ...Object.assign({}, { ...DEFAULTS.babel,
        ...babel
      }),
      caller: {
        name: '@babel/cli'
      },
      plugins: [[new Trextel().plugin, opts], ...(babel?.plugins ?? [])]
    }); // Throw error if result is missing

    if (!result) throw new Error(`Could not compile file ${filename}`); // Get output filename
    // @ts-expect-error No overload matches this call

    const output = filename.replace(pattern, to.call ? to : `.${to}`); // Stringify source code

    result.code = String(result.code); // Handle source map

    result = await addSourceMap(opts, result, {
      input: filename,
      output
    }); // Save file, update file permissions, and remove references to old file

    await saveFile(output, result.code);
    await fs.chmod(output, (await fs.stat(filename)).mode);
    await fs.unlink(filename);
    return result;
  }

}

export const trext = Trext.trext;
export const trextFile = Trext.trextFile;
export default Trext;
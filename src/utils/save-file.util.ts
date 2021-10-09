import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'

/**
 * @file Utilities - saveFile
 * @module trext/utils/saveFile
 */

/**
 * Saves a file. Creates a new directory if necessary.
 *
 * @async
 * @param {string} filename - Name of file to save
 * @param {string | Buffer} data - File content
 * @return {Promise<void>} Empty promise when complete
 */
const saveFile = async (
  filename: string,
  data: string | Buffer
): Promise<void> => {
  await mkdirp(path.dirname(filename))
  return await fs.writeFile(filename, data)
}

export default saveFile

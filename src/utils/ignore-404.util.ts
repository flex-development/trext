/**
 * @file Utilities - ignore404
 * @module trext/utils/ignore404
 */

/**
 * Waits for a promise to complete and rejects **only if** an error is thrown
 * and the error is **not** a missing file or directory error.
 *
 * @template T - Data in promise
 *
 * @async
 * @param {Promise<T>} p - Promise to evaluate
 * @return {Promise<T | null>} Data in promise or null
 * @throws {NodeJS.ErrnoException}
 */
async function ignore404<T extends any>(p: Promise<T>): Promise<T | null> {
  try {
    return await p
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }

  return null
}

export default ignore404

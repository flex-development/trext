import path from 'node:path'
import { createMatchPath, loadConfig } from 'tsconfig-paths'
/** @type {import('ts-node/dist/esm').registerAndCreateEsmHooks} */
const hooks = await import('ts-node/esm')

/**
 * @file Helpers - Custom ESM Loader Hooks
 * @module tools/loaders/esm
 * @see https://github.com/TypeStrong/ts-node/issues/1007
 * @see https://nodejs.org/docs/latest-v12.x/api/all.html#esm_hooks
 */

/** @typedef {'builtin'|'commonjs'|'dynamic'|'json'|'module'|'wasm'} Format */
/** @typedef {{ parentURL: string }} ResolveContext */
/** @typedef {{ url: string }} ResolvedFile */

/**
 * Determines if `url` should be interpreted as a CommonJS or ES module.
 *
 * @async
 * @param {string} url - File URL
 * @param {Record<string, never>} ctx - Resolver context
 * @param {typeof hooks.getFormat} defaultGetFormat - Default format function
 * @return {Promise<{ format: Format }>} Promise containing module format
 */
export const getFormat = async (url, ctx, defaultGetFormat) => {
  // Get file extension
  const ext = path.extname(url)

  // Force extensionless files in `bin` directories to load as commonjs
  if (/^file:\/\/\/.*\/bin\//.test(url) && !ext) return { format: 'commonjs' }

  // ! Fixes `TypeError [ERR_INVALID_MODULE_SPECIFIER]: Invalid module
  // ! "file:///$HOME/node_modules/typescript-esm/dist/tsc-esm"`
  if (url.includes('typescript-esm/dist/tsc-esm')) return { format: 'commonjs' }

  // Load TypeScript files as ESM
  // See `tsconfig.json#ts-node.moduleTypes` for file-specific overrides
  if (ext === '.ts') return { format: 'module' }

  // Defer to ts-node for all other URLs
  return await hooks.getFormat(url, ctx, defaultGetFormat)
}

/**
 * Returns the resolved file URL for a given module `specifier` and parent URL.
 *
 * @see https://github.com/TypeStrong/ts-node/discussions/1450
 * @see https://github.com/dividab/tsconfig-paths
 *
 * @async
 * @param {string} specifier - Module specifier
 * @param {ResolveContext} ctx - Function context
 * @param {string} [ctx.parentURL] - URL of module that imported `specifier`
 * @param {typeof hooks.resolve} defaultResolve - Default resolve fn
 * @return {Promise<ResolvedFile>} Resolved file URL
 * @throws {Error}
 */
export const resolve = async (specifier, ctx, defaultResolve) => {
  // Load TypeScript config to get path mappings
  const result = loadConfig(process.cwd())

  // Handle possible error
  if (result.resultType === 'failed') throw new Error(result.message)

  // Get base URL and path aliases
  const { absoluteBaseUrl, paths } = result

  // Attempt to resolve specifier using path mappings
  const match = createMatchPath(absoluteBaseUrl, paths)(specifier)

  // Update specifier if match was found
  if (match) specifier = match

  // Defer to ts-node
  return await hooks.resolve(specifier, ctx, defaultResolve)
}

/**
 * Applies transformations to `source`.
 *
 * @async
 * @param {Buffer | string} source - Source code to transform
 * @param {{ format: Format; url: string }} ctx - Function context
 * @param {Format} [ctx.format] - Module format of source code
 * @param {string} [ctx.url] - Source code file URL
 * @param {typeof transformSource} defaultTransformSource - Default transform fn
 * @return {Promise<{ source: string }>} Promise containing source code
 */
export const transformSource = hooks.transformSource

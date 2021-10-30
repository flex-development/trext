import LogLevel from '@flex-development/log/enums/log-level.enum'
import path from 'node:path'
import { inspect } from 'node:util'
import replace from 'replace-in-file'
import { applyChanges } from 'resolve-tspaths/dist/steps/applyChanges'
import { computeAliases } from 'resolve-tspaths/dist/steps/computeAliases'
import { generateChanges } from 'resolve-tspaths/dist/steps/generateChanges'
import { getFilesToProcess } from 'resolve-tspaths/dist/steps/getFilesToProcess'
import type { Alias, Change, ProgramPaths } from 'resolve-tspaths/dist/types'
import { TSConfigPropertyError } from 'resolve-tspaths/dist/utils/errors'
import { TsConfig } from 'tsc-prog'
import logger from './logger'

/**
 * @file Helpers - tsRemap
 * @module tools/helpers/tsRemap
 */

export type TsRemapOptions = {
  /**
   * TypeScript compiler options.
   */
  compilerOptions: TsConfig['compilerOptions']

  /**
   * Current working directory.
   *
   * @default process.cwd()
   */
  cwd?: string

  /**
   * Do **not** emit any file changes.
   */
  dryRun?: boolean

  /**
   * List of file extensions in `tsconfig.outDir` that should be processed.
   *
   * @default 'js,d.ts'
   */
  ext?: string

  /**
   * Location of source directory (relative to `cwd`).
   *
   * @default 'src'
   */
  src?: string

  /**
   * Print verbose logs to the console.
   */
  verbose?: boolean
}

export type TsRemapResult = {
  aliases: Alias[]
  changes: Change[]
  paths: Pick<ProgramPaths, 'basePath' | 'outPath' | 'srcPath'>
}

/**
 * Replaces `options.compilerOptions.paths` with relative paths.
 *
 * @param {TsRemapOptions} options - Transformation options
 * @return {TsRemapResult | null} Result object or null
 * @throws {Error}
 */
const tsRemap = (options: TsRemapOptions): TsRemapResult | null => {
  // Get transformation options
  const {
    compilerOptions = {},
    dryRun,
    cwd = process.cwd(),
    ext = 'js,d.ts',
    src = 'src',
    verbose
  } = options

  // Handle missing properties
  if (!compilerOptions.baseUrl) {
    throw new TSConfigPropertyError('resolvePaths', 'compilerOptions.baseUrl')
  } else if (!compilerOptions.outDir) {
    throw new TSConfigPropertyError('resolvePaths', 'compilerOptions.outDir')
  }

  // Get program paths
  const basePath = path.resolve(cwd, compilerOptions.baseUrl)
  const outPath = path.resolve(compilerOptions.outDir)
  const srcPath = path.resolve(cwd, src)

  // Get path aliases
  const aliases = computeAliases(basePath, { compilerOptions })

  // Get files to process
  const files = getFilesToProcess(outPath, ext)

  // Generate path transformations
  const changes = generateChanges(files, aliases, { outPath, srcPath })
  const $changes = `${changes.length} file${changes.length === 1 ? '' : 's'}`
  logger({}, `found ${$changes} using compilerOptions.paths`, [], LogLevel.INFO)

  // Log changes
  if (verbose) {
    for (const change of changes) {
      const changes = [inspect(change.changes, false, null)]
      logger({}, ` ${change.file}`, changes, LogLevel.DEBUG)
    }
  }

  // Apply path transformations
  if (!dryRun) {
    applyChanges(changes)

    replace.sync({
      files: `${outPath}/**/*`,
      from: new RegExp(`(../.*)?${process.env['NODE_MODULES']}/`),
      to: ''
    })

    if (changes.length > 0) logger({}, 'resolve compilerOptions.paths')
  }

  return {
    aliases,
    changes,
    paths: { basePath, outPath, srcPath }
  }
}

export default tsRemap

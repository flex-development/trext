#!/usr/bin/env ts-node

import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import ncc from '@vercel/ncc'
import fs from 'fs/promises'
import path from 'node:path'
import replace from 'replace-in-file'
import rimraf from 'rimraf'
import type { BuildOptions as TsBuildOptions } from 'tsc-prog'
import * as tsc from 'tsc-prog'
import { logDiagnostics } from 'tsc-prog/dist/utils/log'
import ts from 'typescript'
import type { Argv } from 'yargs'
import type { BuildOptions } from '../helpers/build'
import build, { args as bargs } from '../helpers/build'
import logger from '../helpers/logger'
import { $PACKAGE, $WNS } from '../helpers/pkg'
import type { TsRemapOptions } from '../helpers/ts-remap'
import tsRemap from '../helpers/ts-remap'
import tsconfigCascade from '../helpers/tsconfig-cascade'

/**
 * @file CLI - Package Build Workflow
 * @module tools/cli/build-pkg
 */

export type BuildPkgOptions = BuildOptions & {
  /**
   * Specify module build formats.
   *
   * @default ['cjs','esm','types']
   */
  formats?: ('cjs' | 'esm' | 'types')[]

  /** @see BuildPkgOptions.formats */
  f?: BuildPkgOptions['formats']
}

export type BuildPkgArgs = Argv<BuildPkgOptions>
export type BuildPkgArgv = Exclude<BuildPkgArgs['argv'], Promise<any>>

export type BuildModuleFormatOptions = {
  build: TsBuildOptions
  trext: TrextOptions<'js', 'cjs' | 'mjs'>
  remap: TsRemapOptions
}

/** @property {string[]} BUILD_FORMATS - Module build formats */
const BUILD_FORMATS: BuildPkgOptions['formats'] = ['cjs', 'esm', 'types']

/** @property {BuildPkgArgs} args - CLI arguments parser */
const args = bargs
  .option('formats', {
    alias: 'f',
    choices: BUILD_FORMATS,
    default: BUILD_FORMATS,
    describe: 'specify module build format(s)',
    type: 'array'
  })
  .alias('version', 'v')
  .pkgConf('build-pkg') as BuildPkgArgs

/**
 * Executes the package build workflow.
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
async function buildPackage(): Promise<void> {
  await build<BuildPkgOptions>(args.argv, async (argv, context) => {
    const { dryRun, env, formats = [] } = argv
    const { cwd, pwd } = context

    // Build project, convert output extensions, create bundles
    for (const format of formats) {
      // Remove stale build directory
      !dryRun && rimraf.sync(format)
      logger(argv, `remove stale ${format} directory`)

      // Get config file suffix
      const suffix: `${string}.json` = `prod.${format}.json`

      // Get output extension
      const extension: 'cjs' | 'mjs' = `${format === 'cjs' ? 'c' : 'm'}js`

      // Get module format build options
      // See: https://github.com/jeremyben/tsc-prog
      // See: https://github.com/flex-development/trext
      const options: BuildModuleFormatOptions = (() => {
        const tsconfig = (() => {
          const { include = [] } = tsconfigCascade([[cwd, 'prod.json']])
          const { compilerOptions = {}, exclude = [] } = tsconfigCascade([
            [pwd, 'json'],
            [pwd, 'prod.json'],
            [pwd, suffix]
          ])

          compilerOptions.outDir = format
          delete compilerOptions.rootDir

          return { compilerOptions, exclude, include }
        })()

        return {
          build: { ...tsconfig, basePath: cwd, clean: { outDir: true } },
          remap: {
            compilerOptions: { ...tsconfig.compilerOptions, baseUrl: '../..' },
            dryRun,
            verbose: !!JSON.parse(`${process.env['GITHUB_ACTIONS'] || 'false'}`)
          },
          trext: {
            absolute: /@flex-development/,
            babel: { sourceMaps: 'inline' as const },
            from: 'js',
            pattern: /.js$/,
            to: extension
          }
        } as BuildModuleFormatOptions
      })()

      // Build project
      if (!dryRun) {
        // Log compilation start
        logger(argv, 'compilation started')

        // Create TypeScript program
        const program = tsc.createProgramFromConfig(options.build)

        // Compile project
        const emit = program.emit(
          undefined,
          undefined,
          undefined,
          format === 'types'
        )

        // Get all diagnostics
        const diagnostics = [
          ...ts.getPreEmitDiagnostics(program),
          ...emit.diagnostics
        ]

        // Log diagnostics
        logDiagnostics(diagnostics, true)

        // Throw error if files weren't emitted
        if (!program.getCompilerOptions().noEmit && emit.emitSkipped) {
          throw new Error('compilation failed')
        }

        // Log compilation result
        if (diagnostics.length > 0) {
          const message = `compilation done with ${diagnostics.length} errors`
          logger(argv, message, [], LogLevel.WARN)
        } else logger(argv, 'compilation successful')
      }

      // Transform paths
      tsRemap(options.remap)

      if (format !== 'types') {
        // Create bundles
        // See: https://github.com/vercel/ncc
        const BUNDLES = [$WNS, `${$WNS}.min`].map(async name => {
          const bundle = `${format}/${name}.${options.trext.to}`
          const filename = 'src/index.ts'

          if (!dryRun) {
            const { code } = await ncc(`${cwd}/${filename}`, {
              esm: format === 'esm',
              externals: [
                ...Object.keys($PACKAGE?.optionalDependencies ?? {}),
                ...Object.keys($PACKAGE?.peerDependencies ?? {})
              ],
              filename,
              minify: path.extname(name) === '.min',
              production: env === 'production',
              quiet: true,
              target: options.build.compilerOptions?.target,
              // ! type check already performed above
              transpileOnly: true
            })

            await fs.writeFile(bundle, code, { flag: 'wx+' })
            await fs.copyFile(`${format}/index.d.ts`, `${format}/${name}.d.ts`)
            await replace.replaceInFile({
              files: bundle,
              from: ';// CONCATENATED MODULE: ./src/',
              to: ';// CONCATENATED MODULE: ../src/'
            })
          }

          return bundle
        })

        // Complete bundle promises
        logger(argv, `bundle ${format}`, await Promise.all(BUNDLES))

        // Convert TypeScript output to .cjs or .mjs
        !dryRun && (await trext<'js', typeof extension>(format, options.trext))
        logger(argv, `use .${extension} extensions`)
      }
    }
  })
}

buildPackage()

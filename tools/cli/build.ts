#!/usr/bin/env node

import logger from '@flex-development/grease/utils/logger.util'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
import ncc from '@vercel/ncc'
import fs from 'fs-extra'
import path from 'path'
import replace from 'replace-in-file'
import sh from 'shelljs'
import type { BuildOptions as TsBuildOptions, TsConfig } from 'tsc-prog'
import tsc from 'tsc-prog'
import { loadSync as tsconfigLoad } from 'tsconfig/dist/tsconfig'
import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import exec from '../helpers/exec'
import fixImportPaths from '../helpers/fix-import-paths'
import { $PACKAGE, $WNS, $WORKSPACE } from '../helpers/pkg'
import tsconfigCascade from '../helpers/tsconfig-cascade'
// @ts-expect-error ts(2307)
import useDualExports from '../helpers/use-dual-exports.mjs'

/**
 * @file CLI - Package Build Workflow
 * @module tools/cli/build
 */

export type BuildOptions = {
  /**
   * Remove stale build directories.
   *
   * @default true
   */
  clean?: boolean

  /** @see BuildOptions.clean */
  c?: BuildOptions['clean']

  /**
   * See the commands that running `build` would run.
   *
   * @default false
   */
  dryRun?: boolean

  /** @see BuildOptions.dryRun */
  d?: BuildOptions['dryRun']

  /**
   * Name of build environment.
   *
   * @default 'production'
   */
  env?: 'development' | 'production' | 'test'

  /** @see BuildOptions.env */
  e?: BuildOptions['env']

  /**
   * Specify module build formats.
   *
   * @default ['cjs','esm','types']
   */
  formats?: ('cjs' | 'esm' | 'types')[]

  /** @see BuildOptions.formats */
  f?: BuildOptions['formats']

  /**
   * Run preliminary `yarn install` if package contains build scripts.
   *
   * @default false
   */
  install?: boolean

  /** @see BuildOptions.install */
  i?: BuildOptions['install']

  /**
   * Create tarball at specified path.
   *
   * @default '%s-%v.tgz'
   */
  out?: string

  /** @see BuildOptions.out */
  o?: BuildOptions['out']

  /**
   * Run `prepack` script.
   *
   * @default false
   */
  prepack?: boolean

  /** @see BuildOptions.prepack */
  p?: BuildOptions['prepack']

  /**
   * Pack the project once build is complete.
   *
   * @default false
   */
  tarball?: boolean

  /** @see BuildOptions.tarball */
  t?: BuildOptions['tarball']
}

/** @property {string[]} BUILD_FORMATS - Module build formats */
const BUILD_FORMATS: BuildOptions['formats'] = ['cjs', 'esm', 'types']

/** @property {string} COMMAND_PACK - Base pack command */
const COMMAND_PACK: string = 'yarn pack'

/** @property {string} CWD - Current working directory */
const CWD: string = process.cwd()

/** @property {Argv<BuildOptions>} args - CLI arguments parser */
const args = yargs(hideBin(process.argv))
  .usage('$0 [options]')
  .option('clean', {
    alias: 'c',
    default: true,
    describe: 'remove stale build directories',
    type: 'boolean'
  })
  .option('dryRun', {
    alias: 'd',
    default: false,
    describe: 'see the commands that running `build` would run',
    type: 'boolean'
  })
  .option('env', {
    alias: 'e',
    choices: ['production', 'test', 'development'],
    default: 'production',
    describe: 'name of build environment',
    requiresArg: true,
    type: 'string'
  })
  .option('formats', {
    alias: 'f',
    choices: BUILD_FORMATS,
    default: BUILD_FORMATS,
    description: 'specify module build format(s)',
    type: 'array'
  })
  .option('install', {
    alias: 'i',
    default: false,
    description: 'run `yarn install` if package contains build scripts',
    type: 'boolean'
  })
  .option('out', {
    alias: 'o',
    default: '%s-%v.tgz',
    description: 'create tarball at specified path',
    requiresArg: true,
    type: 'string'
  })
  .option('prepack', {
    alias: 'p',
    default: false,
    description: 'run `prepack` script',
    type: 'boolean'
  })
  .option('tarball', {
    alias: 't',
    default: false,
    description: 'pack the project once build is complete',
    type: 'boolean'
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .pkgConf('build')
  .wrap(98) as Argv<BuildOptions>

/** @property {BuildOptions} argv - CLI arguments object */
const argv = args.argv as BuildOptions

/**
 * Executes the package build workflow.
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
async function build(): Promise<void> {
  const { dryRun, env, formats = [], tarball } = argv

  // Log workflow start
  logger(
    argv,
    'starting build workflow',
    [$WORKSPACE, `[dry=${dryRun}]`],
    LogLevel.INFO
  )

  try {
    // Set environment variables
    exec(`node ./tools/cli/loadenv.cjs -c ${argv.env}`, argv.dryRun)
    logger(argv, `set ${argv.env} environment variables`)

    // Build project, convert output extensions, create bundles
    for (const format of formats) {
      // Get build options
      // See: https://github.com/jeremyben/tsc-prog
      const options: TsBuildOptions = {
        ...((): TsConfig => {
          const { compilerOptions, exclude } = tsconfigCascade([
            [CWD, 'json'],
            [CWD, 'prod.json'],
            [CWD, `prod.${format}.json`]
          ])

          return {
            compilerOptions,
            exclude,
            include: tsconfigLoad(CWD, 'tsconfig.prod.json').config.include
          }
        })(),
        basePath: CWD,
        clean: { outDir: argv.clean || undefined }
      }

      // Build project
      !dryRun && tsc.build(options)
      !dryRun && format === 'cjs' && useDualExports(`./${format}/**`)
      dryRun && logger(argv, `build ${format}`)

      // Fix node module import paths
      fixImportPaths()

      if (format !== 'types') {
        // Get extension transformation options
        const trext_opts: TrextOptions<'js', 'cjs' | 'mjs'> = {
          babel: { sourceMaps: 'inline' as const },
          from: 'js',
          pattern: /.js$/,
          to: `${format === 'cjs' ? 'c' : 'm'}js`
        }

        // Convert TypeScript output to .cjs or .mjs
        !dryRun && (await trext<'js' | 'cjs' | 'mjs'>(`${format}/`, trext_opts))
        logger(argv, `use .${trext_opts.to} extensions`)

        // Create bundles
        // See: https://github.com/vercel/ncc
        const BUNDLES = [$WNS, `${$WNS}.min`].map(async name => {
          const bundle = `${format}/${name}.${trext_opts.to}`
          const filename = `${format}/index.${trext_opts.to}`
          const minify = path.extname(name) === '.min'

          if (!dryRun) {
            const { code } = await ncc(`${CWD}/${filename}`, {
              esm: format === 'esm',
              externals: Object.keys($PACKAGE?.peerDependencies ?? {}),
              filename,
              minify: minify,
              production: env === 'production',
              quiet: true,
              target: options.compilerOptions?.target
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
      }
    }

    // Pack project
    if (tarball) {
      const { install, out: outFile, prepack } = argv

      // Pack command flags
      const flags = [
        `${dryRun ? '--dry-run' : ''}`,
        `--out ${outFile}`,
        `${install ? '--install-if-needed' : ''}`
      ]

      // Check if package has postinstall and prepack scripts
      const has_postinstall = typeof $PACKAGE.scripts?.postinstall === 'string'
      const has_prepack = typeof $PACKAGE.scripts?.prepack === 'string'

      // Check if prepack script should be disabled
      const disable_prepack = has_prepack && !prepack

      // Disable postinstall script
      has_postinstall && exec('toggle-scripts -postinstall', dryRun)
      has_postinstall && logger(argv, 'disable postinstall script')

      // Disable prepack script
      disable_prepack && exec('toggle-scripts -prepack', dryRun)
      disable_prepack && logger(argv, 'disable prepack script')

      // Execute pack command
      exec(`${COMMAND_PACK} ${flags.join(' ')}`.trim(), dryRun)
      logger(argv, 'create tarball')

      // Renable postinstall script
      has_postinstall && exec('toggle-scripts +postinstall', dryRun)
      has_postinstall && logger(argv, 'renable postinstall script')

      // Renable prepack script
      disable_prepack && exec('toggle-scripts +prepack', dryRun)
      disable_prepack && logger(argv, 'renable prepack script')
    }
  } catch (error) {
    logger(argv, (error as Error).message, [], LogLevel.ERROR)
    sh.exit((error as any).code || 1)
  }

  // Log workflow end
  logger(argv, 'build workflow complete', [$WORKSPACE], LogLevel.INFO)
}

build()

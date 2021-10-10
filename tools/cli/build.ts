#!/usr/bin/env node

import logger from '@flex-development/grease/utils/logger.util'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import { trext } from '@trext/plugins/trext.plugin'
import ncc from '@vercel/ncc'
import fs from 'fs-extra'
import path from 'path'
import replace from 'replace-in-file'
import sh from 'shelljs'
import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import exec from '../helpers/exec'
import fixNodeModulePaths from '../helpers/fix-node-module-paths'
import { $PACKAGE, $WORKSPACE, $WORKSPACE_NO_SCOPE } from '../helpers/pkg'
// @ts-expect-error TS2307
import useDualExports from '../helpers/use-dual-exports.mjs'

/**
 * @file CLI - Package Build Workflow
 * @module tools/cli/build
 */

export type BuildOptions = {
  /**
   * Name of build environment.
   *
   * @default 'production'
   */
  env?: 'development' | 'production' | 'test'

  /** @see BuildOptions.env */
  e?: BuildOptions['env']

  /**
   * See the commands that running `build` would run.
   *
   * @default false
   */
  dryRun?: boolean

  /** @see BuildOptions.dryRun */
  d?: BuildOptions['dryRun']

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

/** @property {string[]} BUNDLE_NAMES - Partial bundle names */
const BUNDLE_NAMES: string[] = [
  $WORKSPACE_NO_SCOPE,
  `${$WORKSPACE_NO_SCOPE}.min`
]

/** @property {string} COMMAND_PACK - Base pack command */
const COMMAND_PACK: string = 'yarn pack'

/** @property {string} CWD - Current working directory */
const CWD: string = process.cwd()

/** @property {string[]} ENV_CHOICES - Build environment options */
const ENV_CHOICES: BuildOptions['env'][] = ['production', 'test', 'development']

/** @property {Argv<BuildOptions>} args - CLI arguments parser */
const args = yargs(hideBin(process.argv))
  .usage('$0 [options]')
  .option('env', {
    alias: 'e',
    choices: ENV_CHOICES,
    default: 'production',
    describe: 'name of build environment',
    requiresArg: true,
    type: 'string'
  })
  .option('dryRun', {
    alias: 'd',
    default: false,
    describe: 'see the commands that running `build` would run',
    type: 'boolean'
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
  // Log workflow start
  logger(
    argv,
    'starting build workflow',
    [$WORKSPACE, `[dry=${argv.dryRun}]`],
    LogLevel.INFO
  )

  try {
    // Set environment variables
    exec(`node ./tools/cli/loadenv.cjs -c ${argv.env}`, argv.dryRun)
    logger(argv, `set ${argv.env} environment variables`)

    // Build project, convert output extensions, create bundles
    for (const format of argv.formats ?? []) {
      // Get tsconfig config file
      const tsconfig: string = `tsconfig.prod.${format}.json`

      // Remove stale directory
      exec(`rimraf ${format}`, argv.dryRun)
      logger(argv, `remove stale ${format} directory`)

      // Run build command
      if (exec(`ttsc -p ${tsconfig}`, argv.dryRun) || argv.dryRun) {
        // ! Add ESM-compatible export statement to `exports.default` statements
        if (format === 'cjs') useDualExports([`./${format}/**`] as never[])
        logger(argv, `build ${format}`)
      }

      // Fix node module import paths
      fixNodeModulePaths()

      if (format !== 'types') {
        // Get trext options
        const trext_options = {
          babel: { sourceMaps: 'inline' as const },
          from: 'js',
          pattern: /.js$/,
          to: `${format === 'cjs' ? 'c' : 'm'}js`
        }

        // Convert TypeScript output to .cjs or .mjs
        !argv.dryRun && (await trext(`${format}/`, trext_options))
        logger(argv, `use .${trext_options.to} extensions`)

        // Create bundles
        const BUNDLES = BUNDLE_NAMES.map(async name => {
          const bundle = `${format}/${name}.${trext_options.to}`
          const filename = 'src/index.ts'
          const minify = path.extname(name) === '.min'

          if (!argv.dryRun) {
            const { code } = await ncc(`${CWD}/${filename}`, {
              esm: format === 'esm',
              externals: Object.keys($PACKAGE?.peerDependencies ?? {}),
              filename,
              minify: minify,
              production: argv.env === 'production',
              quiet: true,
              target: format === 'cjs' ? 'es5' : 'es2020'
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
    if (argv.tarball) {
      const { dryRun, out: outFile, install, prepack } = argv

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

#!/usr/bin/env node

import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { TrextOptions } from '@flex-development/trext'
import { trext } from '@flex-development/trext'
// @ts-expect-error ts(7016)
import ncc from '@vercel/ncc'
import ch from 'chalk'
import fs from 'fs/promises'
import path from 'path'
import replace from 'replace-in-file'
import sh from 'shelljs'
import type { ReplaceTscAliasPathsOptions } from 'tsc-alias'
import { replaceTscAliasPaths as tsTransformPaths } from 'tsc-alias'
import type { BuildOptions as TsBuildOptions, TsConfig } from 'tsc-prog'
import tsc from 'tsc-prog'
import { loadSync as tsconfigLoad } from 'tsconfig/dist/tsconfig'
import { inspect } from 'util'
import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import exec from '../helpers/exec'
import logger from '../helpers/logger'
import { $PACKAGE, $WNS, $WORKSPACE } from '../helpers/pkg'
import tsconfigCascade from '../helpers/tsconfig-cascade'

/**
 * @file CLI - Package Build Workflow
 * @module tools/cli/build
 */

export type BuildOptions = {
  /**
   * See the commands that running `build` would run.
   *
   * @default false
   */
  dryRun?: boolean

  /**
   * Name of build environment.
   *
   * @default 'production'
   */
  env?: 'development' | 'production' | 'test'

  /**
   * Specify module build formats.
   *
   * @default ['cjs','esm','types']
   */
  formats?: ('cjs' | 'esm' | 'types')[]

  /**
   * Run preliminary `yarn install` if package contains build scripts.
   *
   * @default false
   */
  install?: boolean

  /**
   * Create tarball at specified path.
   *
   * @default '%s-%v.tgz'
   */
  out?: string

  /**
   * Run `prepack` script.
   *
   * @default false
   */
  prepack?: boolean

  /**
   * Pack the project once build is complete.
   *
   * @default false
   */
  tarball?: boolean
}

export type BuildArgs = Argv<BuildOptions>
export type BuildArgv = Exclude<BuildArgs['argv'], Promise<any>>

export type BuildModuleFormatOptions = {
  alias: ReplaceTscAliasPathsOptions
  build: TsBuildOptions
  trext: TrextOptions<'js', 'cjs' | 'mjs'>
}

/** @property {string[]} BUILD_FORMATS - Module build formats */
const BUILD_FORMATS: BuildOptions['formats'] = ['cjs', 'esm', 'types']

/** @property {string} COMMAND_PACK - Base pack command */
const COMMAND_PACK: string = 'yarn pack'

/** @property {string} CWD - Current working directory */
const CWD: string = process.cwd()

/** @property {string} PWD - Project working directory */
const PWD: string = process.env.PROJECT_CWD as string

const args = yargs(hideBin(process.argv), CWD)
  .usage('$0 [options]')
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
    describe: 'specify module build format(s)',
    type: 'array'
  })
  .option('install', {
    alias: 'i',
    default: false,
    describe: 'run `yarn install` if package contains build scripts',
    type: 'boolean'
  })
  .option('out', {
    alias: 'o',
    default: '%s-%v.tgz',
    describe: 'create tarball at specified path',
    requiresArg: true,
    type: 'string'
  })
  .option('prepack', {
    alias: 'p',
    default: false,
    describe: 'run `prepack` script',
    type: 'boolean'
  })
  .option('tarball', {
    alias: 't',
    default: false,
    describe: 'pack the project once build is complete',
    type: 'boolean'
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .pkgConf('build')
  .wrap(98) as BuildArgs

const argv: BuildArgv = await args.argv
const { dryRun, env, formats = [], tarball } = argv

// Log workflow start
logger(
  argv,
  'starting build workflow',
  [$WORKSPACE, `[dry=${dryRun}]`],
  LogLevel.INFO
)

try {
  // Type check source code
  exec('yarn check:types', dryRun)
  logger(argv, 'type check source code')

  // Set environment variables
  exec(`node ${PWD}/tools/cli/loadenv.cjs -c ${env}`, dryRun)
  logger(argv, `set ${env} environment variables`)

  // Build project, convert output extensions, create bundles
  for (const format of formats) {
    // Get config file suffix
    const suffix: `${string}.json` = `prod.${format}.json`

    // Get module format build options
    // See: https://github.com/justkey007/tsc-alias#usage
    // See: https://github.com/jeremyben/tsc-prog
    // See: https://github.com/flex-development/trext
    const options: BuildModuleFormatOptions = {
      alias: {
        configFile: `tsconfig.prod.${format}.json`,
        outDir: `./${format}`,
        silent: false
      },
      build: {
        ...((): TsConfig => {
          const { compilerOptions = {}, exclude = [] } = tsconfigCascade([
            [PWD, 'json'],
            [PWD, 'prod.json'],
            [PWD, suffix]
          ])

          return {
            compilerOptions,
            exclude,
            include: tsconfigLoad(PWD, 'tsconfig.prod.json').config.include
          }
        })(),
        basePath: CWD,
        clean: { outDir: true }
      },
      trext: {
        babel: { sourceMaps: 'inline' as const },
        from: 'js',
        pattern: /.js$/,
        to: `${format === 'cjs' ? 'c' : 'm'}js`
      }
    }

    // Build project
    !dryRun && tsc.build(options.build)

    // Transform paths
    !dryRun && tsTransformPaths(options.alias)
    dryRun && logger(argv, `build ${format}`)

    if (format !== 'types') {
      // Create bundles
      // See: https://github.com/vercel/ncc
      const BUNDLES = [$WNS, `${$WNS}.min`].map(async name => {
        const bundle = `${format}/${name}.${options.trext.to}`
        const filename = 'src/index.ts'

        if (!dryRun) {
          const { code } = await ncc(`${CWD}/${filename}`, {
            esm: format === 'esm',
            externals: Object.keys($PACKAGE?.peerDependencies ?? {}),
            filename,
            minify: path.extname(name) === '.min',
            production: env === 'production',
            quiet: true,
            target: options.build.compilerOptions?.target,
            // ! @vercel/ncc not compatible with typescript@4.5.0-beta
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
      !dryRun && (await trext<'js', 'cjs' | 'mjs'>(format, options.trext))
      logger(argv, `use .${options.trext.to} extensions`)
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
} catch (err) {
  const error = err as Error & { code?: number; stderr?: string }

  if (!error.stderr) logger(argv, error.message, [], LogLevel.ERROR)
  sh.echo(error.stderr || ch.red(inspect(error, false, null)))
  sh.exit(error?.code ?? 1)
}

// Log workflow end
logger(argv, 'build workflow complete', [$WORKSPACE], LogLevel.INFO)

#!/usr/bin/env ts-node

import LogLevel from '@flex-development/log/enums/log-level.enum'
import ch from 'chalk'
import { inspect } from 'node:util'
import sh from 'shelljs'
import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import exec from './exec'
import logger from './logger'
import { $PACKAGE, $WORKSPACE } from './pkg'

/**
 * @file Helpers - build
 * @module tools/helpers/build
 */

export type BuildOptions = {
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
   * @default process.env.NODE_ENV
   */
  env?: 'development' | 'production' | 'test'

  /** @see BuildOptions.env */
  e?: BuildOptions['env']

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

export type BuildArgs = Argv<BuildOptions>
export type BuildArgv = BuildArgs['argv']

export type BuildContext = {
  cwd: ReturnType<typeof process['cwd']>
  pwd: string
}

export type BuildWorflow<O extends BuildOptions = BuildOptions> = {
  (argv: O, context: BuildContext): any
}

/** @property {BuildContext} context - Build context */
export const CONTEXT: BuildContext = {
  cwd: process.cwd(),
  pwd: process.env['PROJECT_CWD'] as string
}

/** @property {BuildArgs} args - Project working directory */
export const args = yargs(hideBin(process.argv), CONTEXT.cwd)
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
    default: process.env['NODE_ENV'],
    describe: 'node environment',
    requiresArg: true,
    type: 'string'
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
  .alias('help', 'h')
  .wrap(98) as BuildArgs

/**
 * Executes a build `workflow`.
 *
 * @template O - Shape of build options
 *
 * @async
 * @param {O | Promise<O>} [argv] - Build options
 * @param {BuildWorflow<O>} [workflow] - Workflow function
 * @return {Promise<void>} Empty promise when complete
 */
async function build<O extends BuildOptions = BuildOptions>(
  argv: O | Promise<O>,
  workflow?: BuildWorflow<O>
): Promise<void> {
  const { dryRun, env, tarball } = (argv = await argv)

  // Log workflow start
  logger(
    argv,
    'starting build workflow',
    [$WORKSPACE, `[env=${env},dry=${dryRun}]`],
    LogLevel.INFO
  )

  try {
    // Type check source code
    exec(`tsc -p ${CONTEXT.cwd}/tsconfig.prod.json --noEmit`, dryRun)
    logger(argv, 'type check source code')

    // Set environment variables
    if (env) {
      exec(`node ${CONTEXT.pwd}/tools/cli/loadenv.cjs -c ${env}`, dryRun)
      logger(argv, `set ${env} environment variables`)
    }

    // Execute build workflow
    if (workflow) await workflow(argv, CONTEXT)

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
      exec(`yarn pack ${flags.join(' ')}`.trim(), dryRun)
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
}

export default build

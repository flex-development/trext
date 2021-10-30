#!/usr/bin/env node

import grease from '@flex-development/grease'
import type { IGreaseOptions } from '@flex-development/grease/interfaces'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import ch from 'chalk'
import merge from 'lodash.merge'
import { inspect } from 'node:util'
import sh from 'shelljs'
import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import logger from '../helpers/logger'
import { $WNS, $WORKSPACE } from '../helpers/pkg'

/**
 * @file CLI - Release Workflow
 * @module tools/cli/release
 */

export type ReleaseOptions = {
  /**
   * Commit all staged changes, not just release files.
   *
   * @default true
   */
  commitAll?: IGreaseOptions['commitAll']

  /**
   * See the commands that running release would run.
   *
   * @default false
   */
  dryRun?: IGreaseOptions['dryRun']

  /**
   * Is this the first release?
   *
   * @default false
   */
  firstRelease?: IGreaseOptions['firstRelease']

  /**
   * Only populate commits made under this path.
   *
   * @default process.cwd()
   */
  path?: IGreaseOptions['path']

  /**
   * Create prerelease with optional tag id (e.g: `alpha`,`beta`, `dev`).
   */
  prerelease?: IGreaseOptions['prerelease']

  /**
   * Specify release type (like `npm version <major|minor|patch>`).
   */
  releaseAs?: IGreaseOptions['releaseAs']

  /**
   * Save GitHub release as a draft instead of publishing it.
   *
   * @default true
   */
  releaseDraft?: IGreaseOptions['releaseDraft']

  /**
   * Map of steps in the release process that should be skipped.
   *
   * @default true
   */
  skip?: IGreaseOptions['skip']
}

export type ReleaseArgs = Argv<ReleaseOptions>
export type ReleaseArgv = Exclude<ReleaseArgs['argv'], Promise<any>>

const args = yargs(hideBin(process.argv), process.env['INIT_CWD'])
  .usage('$0 [options]')
  .option('commitAll', {
    alias: 'a',
    default: true,
    describe: 'commit all staged changes, not just release files',
    type: 'boolean'
  })
  .option('dryRun', {
    alias: 'd',
    default: false,
    describe: 'see the commands that running release would run',
    type: 'boolean'
  })
  .option('firstRelease', {
    alias: 'f',
    default: false,
    describe: 'is this the first release?',
    type: 'boolean'
  })
  .option('path', {
    alias: 'p',
    default: process.cwd(),
    describe: 'only populate commits made under this path',
    type: 'string'
  })
  .option('prerelease', {
    describe: 'create prerelease with optional tag id',
    requiresArg: true,
    type: 'string'
  })
  .option('releaseAs', {
    alias: 'r',
    describe: 'specify release type (like npm version <major|minor|patch>)',
    requiresArg: true,
    type: 'string'
  })
  .option('releaseDraft', {
    default: true,
    describe: 'release as a draft instead of publishing it',
    type: 'boolean'
  })
  .option('skip', {
    describe: 'map of steps in the release process that should be skipped',
    type: 'array'
  })
  .alias('help', 'h')
  .pkgConf('release')
  .wrap(98) as ReleaseArgs

const argv: ReleaseArgv = await args.argv

const options: IGreaseOptions = {
  commitAll: true,
  gitTagFallback: false,
  gitdir: process.env['PROJECT_CWD'],
  lernaPackage: $WNS,
  releaseAssets: ['./*.tgz'],
  releaseBranchWhitelist: ['release/*'],
  releaseCommitMessageFormat: `release: ${$WORKSPACE}@{{currentTag}}`,
  scripts: {
    postchangelog: `yarn pack -o %s-%v.tgz ${(argv['d'] && '-n') || ''}`.trim(),
    postcommit: 'git pnv',
    postgreaser: 'yarn clean:build',
    prerelease: 'yarn test --no-cache'
  },
  // `continuous-deployment` workflow will create new tag
  skip: { tag: true },
  skipUnstable: false,
  tagPrefix: `${$WNS}@`,
  types: [
    /* eslint-disable sort-keys */
    { type: 'feat', section: ':sparkles: Features' },
    { type: 'fix', section: ':bug: Fixes' },
    { type: 'revert', section: ':rewind: Revert' },
    { type: 'test', section: ':robot: Testing' },
    { type: 'docs', section: ':book: Documentation' },
    { type: 'build', section: ':hammer: Build' },
    { type: 'refactor', section: ':recycle: Code Improvements' },
    { type: 'perf', section: ':zap: Performance Updates' },
    { type: 'style', section: ':nail_care: Formatting & Structure' },
    { type: 'ci', section: ':truck: Continuous Integration & Deployment' },
    { type: 'chore', section: ':pencil2: Housekeeping' },
    { type: 'wip', hidden: true }
    /* eslint-enable sort-keys */
  ],
  verify: false
}

// Log workflow start
logger(
  argv,
  'starting release workflow',
  [$WORKSPACE, `[dry=${argv.dryRun}]`],
  LogLevel.INFO
)

// Run release workflow
// @ts-expect-error Property 'default' does not exist on type
grease.default(merge({}, options, argv)).catch((error: any) => {
  if (error.stderr) return
  else sh.echo(ch.bold.red(inspect(error, false, null)))
})

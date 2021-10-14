#!/usr/bin/env node

import type { Argv } from 'yargs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { LoadEnvOptions } from '../loaders/env'
import loadenv from '../loaders/env'

/**
 * @file CLI - Load Environment
 * @module tools/cli/loadenv
 */

export type LoadEnvArgs = Argv<LoadEnvOptions>
export type LoadEnvArgv = LoadEnvArgs['argv']

const args: LoadEnvArgs = yargs(hideBin(process.argv), process.env.INIT_CWD)
  .usage('$0 [options]')
  .option('cascade', {
    alias: 'c',
    array: true,
    describe: 'enable environment variable cascading',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('directory', {
    alias: 'd',
    default: process.cwd(),
    describe: 'directory to resolve files from',
    required: false,
    type: 'string'
  })
  .option('files', {
    alias: 'f',
    array: true,
    describe: 'file path(s) to load',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('github', {
    alias: 'g',
    describe: 'update github actions environment',
    required: false,
    type: 'boolean'
  })
  .option('print', {
    alias: 'p',
    describe: 'name of variable to print to console',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('result', {
    alias: 'r',
    describe: 'log result when loading is complete',
    required: false,
    type: 'boolean'
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .pkgConf('loadenv')
  .wrap(98)

const argv: LoadEnvArgv = args.argv

loadenv(await argv)

#!/usr/bin/env node

const { Argv } = require('yargs')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const loadenv = require('../loaders/env.cjs')
const { LoadEnvOptions } = require('../loaders/env.cjs')

/**
 * @file CLI - Load Environment
 * @module tools/cli/loadenv
 */

/**
 * @typedef {object} LoadEnvArgs
 * @property {string} [cascade] - {@see LoadEnvOptions.cascade}
 * @property {string} [c] - {@see LoadEnvOptions.cascade}
 * @property {string} [directory=process.cwd] - {@see LoadEnvOptions.directory}
 * @property {string} [d] - {@see LoadEnvOptions.directory}
 * @property {string | string[]} [files=[]] - {@see LoadEnvOptions.files}
 * @property {string | string[]} [f=[]] - {@see LoadEnvOptions.files}
 * @property {string} [print] -{@see LoadEnvOptions.print}
 * @property {string} [p] -{@see LoadEnvOptions.print}
 * @property {boolean} [view=false] - {@see LoadEnvOptions.view}
 * @property {boolean} [v] -{@see LoadEnvOptions.view}
 */

/** @type {Argv<LoadEnvArgs & LoadEnvOptions>} */
const args = yargs(hideBin(process.argv))
  .usage('$0 [options]')
  .option('cascade', {
    alias: 'c',
    array: true,
    describe: 'enable environment variable cascading',
    requiresArg: true,
    type: 'string'
  })
  .option('directory', {
    alias: 'd',
    default: process.cwd(),
    describe: 'directory to resolve files from',
    type: 'string'
  })
  .option('files', {
    alias: 'f',
    array: true,
    default: ['.env'],
    description: 'file path(s) to load',
    requiresArg: true,
    type: 'string'
  })
  .option('github', {
    alias: 'g',
    default: false,
    description: 'update github actions environment',
    type: 'boolean'
  })
  .option('print', {
    alias: 'p',
    describe: 'name of variable to print to console',
    requiresArg: true,
    type: 'string'
  })
  .option('result', {
    alias: 'r',
    default: false,
    description: 'log result when loading is complete',
    type: 'boolean'
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .pkgConf('loadenv')
  .wrap(98)

loadenv(args.argv)

#!/usr/bin/env node

const ch = require('chalk')
const exec = require('child_process').exec
const { config } = require('dotenv')
const expand = require('dotenv-expand')
const fs = require('fs')
const path = require('path')
const { Record } = require('typescript')
const { inspect } = require('util')
const { default: yargs, Argv } = require('yargs')
const { hideBin } = require('yargs/helpers')

/**
 * @file CLI - Load Environment
 * @module tools/cli/loadenv
 */

/**
 * @typedef LoadEnvOptions
 * @property {string[]} [cascade] - Enable environment variable cascading
 * @property {string} [directory=process.cwd()] - Directory to resolve files
 * @property {string[]} [files=[]] - File path(s) to load
 * @property {boolean} [github] - Update GitHub Actions environment
 * @property {string} [print] - Name of variable to print to console
 * @property {boolean} [result] - Log result when loading is complete
 */

/** @typedef {Argv<LoadEnvOptions>} LoadEnvArgs */

/**
 * @typedef {object} LoadEnvResult
 * @property {string} cwd - Directory environment files were loaded from
 * @property {Record<string, string>} env - Environment object
 * @property {string[]} files - Array of (relative) file paths that were loaded
 */

/** @type {LoadEnvArgs} */
const args = yargs(hideBin(process.argv), process.env.INIT_CWD)
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

/**
 * Loads environment files.
 *
 * @return {Promise<LoadEnvResult>} Loaded environment object
 */
const loadenv = async () => {
  /** @type {LoadEnvOptions} */
  const argv = await args.argv

  const {
    cascade,
    directory: cwd = process.cwd(),
    files = ['.env'],
    github = false,
    print,
    result: print_result = false
  } = argv

  // Init file paths array
  let paths = Array.isArray(files) ? files : [files]

  // Handle environment cascading
  if (cascade) {
    paths = paths.reduce((accumulator, path) => {
      return [
        ...accumulator,
        ...(Array.isArray(cascade) ? cascade : [cascade]).flatMap(env => [
          `${path}.${env}.local`,
          `${path}.${env}`
        ])
      ]
    }, [])

    paths = [...new Set([...paths, '.env.local', '.env']).values()]
  }

  // Filter out file paths that don't exist
  paths = paths.filter(p => fs.existsSync(path.join(cwd, p)))

  // Get array with full paths to environment files
  const fpaths = paths.map(p => path.join(cwd, p))

  // Init parsed environment array
  /** @type {LoadEnvResult.env[]} */ const parsed = []

  // Load environment files (and expand)
  for (const full_path of fpaths) {
    parsed.push(expand(config({ path: path.resolve(full_path) })).parsed || {})
  }

  // Init result object
  /** @type {LoadEnvResult} */ const result = {
    cwd,
    env: parsed.reduce((acc, obj) => ({ ...acc, ...obj })),
    files: fpaths.map(p => p.split(`${cwd}/`)[1])
  }

  // Format environment variables
  for (const n of Object.keys(result.env)) result.env[n] = result.env[n].trim()

  // Update GitHub Actions environment
  if (github && process.env.GITHUB_ENV) {
    for (const n of Object.keys(result.env)) {
      exec(`echo "${n}=${result.env[n]}" >> $GITHUB_ENV`)
    }
  }

  // Print selected environment variable
  if (print) console.log(print, process.env[print] || '')

  // Print result
  if (print_result) console.log(ch.gray(inspect(result)))

  return result
}

loadenv()

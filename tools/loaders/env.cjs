const ch = require('chalk')
const exec = require('child_process').exec
const { config } = require('dotenv')
const expand = require('dotenv-expand')
const fs = require('fs-extra')
const path = require('path')
const { Record } = require('typescript')
const { inspect } = require('util')

/**
 * @file Loaders - Environment Loader
 * @module tools/loaders/env
 */

/**
 * @typedef {object} LoadEnvOptions
 * @property {string} [cascade] - Enable environment variable cascading
 * @property {string} [directory=process.cwd] - Directory to resolve files from
 * @property {string | string[]} [files=[]] - File path(s) to load
 * @property {boolean} [github=false] - Update GitHub Actions environment
 * @property {string} [print] - Name of variable to print to console
 * @property {boolean} [result=false] - Log result when loading is complete
 */

/**
 * @typedef {object} LoadedEnvResult
 * @property {string} cwd - Directory environment files were loaded from
 * @property {Record<string,string>} env - Environment object
 * @property {string[]} files - Array of (relative) file paths that were loaded
 */

/**
 * Loads environment files.
 *
 * @param {LoadEnvOptions} [options] - Options
 * @param {string} [options.cascade] - Enable environment variable cascading
 * @param {string | string[]} [options.files=[]] - File path(s) to load
 * @param {boolean} [options.github=false] - Update GitHub Actions environment
 * @param {string} [options.print] - Name of variable to print to console
 * @param {boolean} [options.result=false] - Log result when loading is complete
 * @return {LoadedEnvResult} Loaded environment object
 */
const loadEnvironment = options => {
  const {
    cascade,
    directory: cwd = process.cwd(),
    files = ['.env'],
    github = false,
    print,
    result: print_result = false
  } = options

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

    paths = [...(paths.push('.env.local', '.env') && new Set(paths)).values()]
  }

  // Filter out file paths that don't exist
  paths = paths.filter(p => fs.existsSync(path.join(cwd, p)))

  // Get array with full paths to environment files
  const fpaths = paths.map(p => path.join(cwd, p))

  // Init result object and array of parsed environments
  const result = { cwd, files: fpaths.map(p => p.split(`${cwd}/`)[1]) }
  const parsed = []

  // Load environment files (and expand)
  for (const full_path of fpaths) {
    parsed.push(expand(config({ path: path.resolve(full_path) })).parsed)
  }

  // Get environment object
  result.env = parsed.reduce((accumulator, obj) => ({ ...accumulator, ...obj }))

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

module.exports = loadEnvironment

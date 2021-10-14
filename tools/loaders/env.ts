import ch from 'chalk'
import { exec } from 'child_process'
import { config } from 'dotenv'
import expand from 'dotenv-expand'
import fs from 'fs'
import path from 'path'
import { inspect } from 'util'

/**
 * @file Loaders - Environment Loader
 * @module tools/loaders/env
 */

export type LoadEnvOptions = {
  /**
   * Enable environment variable cascading.
   */
  cascade?: string[]

  /**
   * Directory to resolve files from.
   *
   * @default process.cwd()
   */
  directory?: string

  /**
   * File path(s) to load.
   *
   * @default []
   */
  files?: string[]

  /**
   * Update GitHub Actions environment if `process.env.GITHUB_ENV` is defined.
   *
   * @default false
   */
  github?: boolean

  /**
   * Name of variable to print to console.
   */
  print?: string

  /**
   * Log result when loading is complete.
   */
  result?: boolean
}

export type LoadEnvResult = {
  /**
   * Directory environment files were loaded from.
   */
  cwd: string

  /**
   * Environment object.
   */
  env: Record<string, string>

  /**
   * Array of (relative) file paths that were loaded.
   */
  files: string[]
}

/**
 * Loads environment files.
 *
 * @param {LoadEnvOptions} [options] - Options
 * @param {string} [options.cascade] - Enable environment variable cascading
 * @param {string[]} [options.files=[]] - File path(s) to load
 * @param {boolean} [options.github=false] - Update GitHub Actions environment
 * @param {string} [options.print] - Name of variable to print to console
 * @param {boolean} [options.result=false] - Log result when loading is complete
 * @return {LoadEnvResult} Loaded environment object
 */
const loadEnvironment = (options: LoadEnvOptions = {}): LoadEnvResult => {
  const {
    cascade,
    directory: cwd = process.cwd(),
    files = ['.env'],
    github = false,
    print,
    result: print_result = false
  } = options

  // Init file paths array
  let paths: string[] = Array.isArray(files) ? files : [files]

  // Handle environment cascading
  if (cascade) {
    paths = paths.reduce((accumulator: string[], path: string) => {
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
  const parsed: LoadEnvResult['env'][] = []

  // Load environment files (and expand)
  for (const full_path of fpaths) {
    parsed.push(expand(config({ path: path.resolve(full_path) })).parsed || {})
  }

  // Init result object
  const result: LoadEnvResult = {
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

export default loadEnvironment

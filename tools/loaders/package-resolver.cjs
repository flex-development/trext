const { Config } = require('@jest/types')

/**
 * @file Loaders - Jest Package Resolver
 * @module tools/loaders/packageResolver
 * @see https://github.com/facebook/jest/issues/9771#issuecomment-676828152
 * @see https://jestjs.io/docs/next/configuration#resolver-string
 */

/** @typedef {(pkg: any, pkgfile: string) => any} PackageFilter */
/** @typedef {(pkg: any, path: string, relPath: string) => string} PathFilter */

/**
 * @typedef {object} ResolverOptions
 * @property {string} basedir - Directory to begin resolving from
 * @property {string[]} conditions - Module import conditions
 * @property {typeof packageResolver} defaultResolver - Default resolver fn
 * @property {string[]} extensions - Array of file extensions to search
 * @property {string[]} moduleDirectory - Directory (or directories) in which to
 * recursively look for modules
 * @property {PackageFilter} packageFilter - Transform parsed `package.json`
 * contents before looking at `main` field
 * @property {PathFilter} pathFilter - Transform package paths
 * @property {string[]} paths - Array containing paths to search if nothing is
 * found while recursively searching `moduleDirectory` paths
 * @property {string} rootDir - Project root directory
 */

/**
 * Custom resolver that forces Jest to use a package's `module` field. If the
 * field is undefined, the `main` field will be used instead.
 *
 * @param {Config.Path} path - Path to module to resolve
 * @param {ResolverOptions} options - Resolver options
 * @return {Config.Path} Resolved path
 */
const packageResolver = (path, options) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: pkg => ({ ...pkg, main: pkg.module || pkg.main })
  })
}

module.exports = packageResolver

import type { PackageJson } from 'read-pkg'
import { readPackageSync } from 'read-pkg'

/**
 * @file Helpers - Get Package Data
 * @module tools/helpers/pkg
 */

/**
 * Returns `package.json` data.
 *
 * @param {string} [cwd=process.cwd()] - Current working directory
 * @return {PackageJson} `package.json` data
 */
const pkg = (cwd: string = process.cwd()): PackageJson => {
  const data = readPackageSync({ cwd, normalize: false })
  return { ...data, _id: `${data.name}@${data.version}` } as PackageJson
}

/** @property {PackageJson} PACKAGE - package.json data */
export const $PACKAGE: PackageJson = pkg()

/** @property {string} $VERSION - Package version */
export const $VERSION: string = pkg().version as string

/** @property {string} $WORKSPACE - Name of NPM package */
export const $WORKSPACE: string = process.env.npm_package_name as string

/** @property {string} name_no_scope - Package name without scope */
export const $WNS: string = $WORKSPACE.split('/')[1]

/** @property {string} $ORG - Organization name (without `@` symbol) */
export const $ORG: string = $WORKSPACE.split('/')[0].slice(1)

/** @property {string} $WID - Normalized package name */
export const $WID: string = `${$ORG}-${$WNS}`

export default pkg

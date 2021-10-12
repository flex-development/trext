import merge from 'lodash.merge'
import { TsConfig } from 'tsc-prog'
import { loadSync as load } from 'tsconfig/dist/tsconfig'

/**
 * @file Helpers - tsconfigCascade
 * @module tools/helpers/tsconfigCascade
 */

export type TsCascadeConfig = [string, 'json' | `${string}.json`]

/**
 * Deep merges TypeScript config files.
 *
 * @param {TsCascadeConfig[]} [configs=[]] - Array of suffix config items
 * @param {boolean} [root_paths=true] - Make aliases relative to `PROJECT_CWD`
 * @return {TsConfig} Tsconfig object
 */
const tsconfigCascade = (
  configs: TsCascadeConfig[] = [],
  root_paths: boolean = true
): TsConfig => {
  const $: TsCascadeConfig[] = configs.map(c => [c[0], `tsconfig.${c[1]}`])
  const tsconfig = merge(...($.map(arg => load(...arg).config) as [TsConfig]))

  if (root_paths && tsconfig.compilerOptions?.paths) {
    const root = process.env.PROJECT_CWD
    const { paths } = tsconfig.compilerOptions

    for (const alias of Object.keys(paths)) {
      tsconfig.compilerOptions.paths[alias][0] = `${root}/${paths[alias][0]}`
    }
  }

  return tsconfig
}

export default tsconfigCascade

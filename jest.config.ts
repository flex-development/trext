import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'
import pkg from './package.json'

/**
 * @file Jest Configuration - Root
 * @see https://jestjs.io/docs/configuration
 */

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: pkg.name.split('/')[1]
}

export default config

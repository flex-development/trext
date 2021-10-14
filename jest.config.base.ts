import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import { loadSync as tsconfigLoad } from 'tsconfig/dist/tsconfig'

/**
 * @file Jest Configuration - Base
 * @see https://jestjs.io/docs/configuration
 * @see https://orlandobayo.com/blog/monorepo-testing-using-jest
 */

const PWD = process.env.PROJECT_CWD as string
const NODE_MODULES = process.env.NODE_MODULES as string
const TYPE = 'e2e|functional|integration'
const prefix = '<rootDir>'

const { compilerOptions } = tsconfigLoad(PWD, 'tsconfig.json').config

const config: Config.InitialOptions = {
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      useESM: true
    }
  },
  moduleFileExtensions: ['node', 'js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix }),
  preset: 'ts-jest/presets/js-with-ts-esm',
  prettierPath: `<rootDir>/${NODE_MODULES}/prettier`,
  reporters: ['default', 'jest-github-reporter'],
  resolver: '<rootDir>/tools/loaders/package-resolver.cjs',
  roots: ['<rootDir>/__mocks__', '<rootDir>/src'],
  setupFiles: ['<rootDir>/__tests__/config/setup.ts'],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js',
    '<rootDir>/__tests__/config/setup-after-env.ts'
  ],
  testRegex: `(/__tests__/)(spec/(${TYPE}))?(.*)(${TYPE})?.spec.ts$`,
  testRunner: 'jest-jasmine2',
  transformIgnorePatterns: [],
  verbose: true
}

export default config

import type { Config } from '@jest/types'
import { parse } from 'comment-json'
import fs from 'fs-extra'
import { pathsToModuleNameMapper } from 'ts-jest/utils'

/**
 * @file Jest Configuration - Base
 * @see https://jestjs.io/docs/configuration
 * @see https://orlandobayo.com/blog/monorepo-testing-using-jest
 */

const { compilerOptions } = parse(fs.readFileSync('./tsconfig.json').toString())

const NODE_MODULES = process.env.NODE_MODULES as string
const TYPE = 'e2e|functional|integration'
const prefix = '<rootDir>'

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

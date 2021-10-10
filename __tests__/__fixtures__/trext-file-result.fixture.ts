import DEFAULTS from '@trext/config/defaults.config'
import type { TrextFileResult } from '@trext/types'
import fs from 'fs'
import FILENAMES from './filenames.fixture'

/**
 * @file Test Fixture - TrextFileResult
 * @module tests/fixtures/TrextFileResult
 */

export const SOURCE_FILENAME: string = FILENAMES[0]
export const CWD: string = process.cwd()
export const FILENAME: string = `${CWD}/${SOURCE_FILENAME}`

const SOURCE_CODE = fs.readFileSync(FILENAME, 'utf8').toString()

export default {
  ast: null,
  code: SOURCE_CODE,
  map: {
    file: SOURCE_FILENAME,
    mappings:
      // eslint-disable-next-line spellcheck/spell-checker
      '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',
    names: [],
    sourceRoot: '',
    sources: ['../src/trext.ts'],
    sourcesContent: [
      `${SOURCE_CODE}\n"./config/defaults.config""./interfaces""./plugins/trextel.plugin""./types"`
    ],
    version: 3
  },
  metadata: {},
  options: {
    assumptions: {},
    babelrc: false,
    browserslistConfigFile: false,
    caller: { name: '@babel/cli' },
    cloneInputAst: true,
    configFile: false,
    cwd: CWD,
    envName: 'development',
    filename: FILENAME,
    generatorOpts: {
      auxiliaryCommentAfter: undefined,
      auxiliaryCommentBefore: undefined,
      comments: true,
      compact: 'auto',
      filename: FILENAME,
      minified: undefined,
      retainLines: undefined,
      shouldPrintComment: undefined,
      sourceFileName: SOURCE_FILENAME,
      sourceMaps: true,
      sourceRoot: undefined
    },
    parserOpts: {
      plugins: [],
      sourceFileName: FILENAME,
      sourceType: 'module'
    },
    passPerPreset: false,
    plugins: [
      {
        generatorOverride: undefined,
        key: 'Trextel',
        manipulateOptions: undefined,
        options: {
          ...DEFAULTS,
          from: 'js',
          to: 'cjs'
        },
        parserOverride: undefined,
        post: undefined,
        pre: undefined,
        visitor: {
          _exploded: true,
          _verified: true,
          CallExpression: { enter: [[jest.fn()]] },
          ImportDeclaration: { enter: [[jest.fn()]] }
        }
      }
    ],
    presets: [],
    root: CWD,
    rootMode: 'root',
    sourceMaps: true,
    targets: {}
  },
  sourceType: 'module'
} as TrextFileResult

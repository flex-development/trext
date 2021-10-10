import { transformFileAsync } from '@babel/core'
import FILENAMES from '@tests/fixtures/filenames.fixture'
import STATS from '@tests/fixtures/stats.fixture'
import TFRES, { FILENAME } from '@tests/fixtures/trext-file-result.fixture'
import DEFAULTS from '@trext/config/defaults.config'
import type { TrextOptions } from '@trext/interfaces'
import Trextel from '@trext/plugins/trextel.plugin'
import addSourceMap from '@trext/utils/add-source-map.util'
import glob from '@trext/utils/glob.util'
import saveFile from '@trext/utils/save-file.util'
import fs from 'fs/promises'
import TestSubject from '../trext.plugin'

/**
 * @file Functional Tests - Trext
 * @module trext/plugins/tests/functional/Trext
 */

jest.mock('@trext/utils/add-source-map.util')
jest.mock('@trext/utils/glob.util')
jest.mock('@trext/utils/save-file.util')
jest.mock('fs/promises')

const mockAddSourceMap = addSourceMap as jest.MockedFunction<
  typeof addSourceMap
>
const mockFs = fs as jest.Mocked<typeof fs>
const mockGlob = glob as jest.MockedFunction<typeof glob>
const mockSaveFile = saveFile as jest.MockedFunction<typeof saveFile>
const mockTransformFileAsync = transformFileAsync as jest.MockedFunction<
  typeof transformFileAsync
>

describe('functional:plugins/Trext', () => {
  const cwd: string = 'esm'
  const OPTIONS_CJS: TrextOptions<'js', 'cjs'> = { from: 'js', to: 'cjs' }
  const OPTIONS_MJS: TrextOptions<'js', 'mjs'> = { ...OPTIONS_CJS, to: 'mjs' }

  // @ts-expect-error No overload matches this call
  const FILENAME_CJS = FILENAME.replace(OPTIONS_CJS.from, OPTIONS_CJS.to)

  describe('.trext', () => {
    const spy_trextFile = jest.spyOn(TestSubject, 'trextFile')

    afterAll(() => {
      spy_trextFile.mockRestore()
    })

    beforeAll(() => {
      spy_trextFile.mockImplementation(jest.fn())
    })

    beforeEach(async () => {
      mockGlob.mockReturnValue(new Promise(resolve => resolve(FILENAMES)))

      await TestSubject.trext<'js', 'mjs'>(cwd, OPTIONS_MJS)
    })

    it('should get files to transform', () => {
      expect(mockGlob).toBeCalledTimes(1)
      expect(mockGlob).toBeCalledWith(`${cwd}/**/*.${OPTIONS_MJS.from}`)
    })

    it('should transform files', () => {
      expect(spy_trextFile).toBeCalledTimes(FILENAMES.length)
    })
  })

  describe('.trextFile', () => {
    beforeEach(async () => {
      mockFs.stat.mockReturnValue(new Promise(resolve => resolve(STATS)))
    })

    it('should transform file', async () => {
      // Arrange
      // @ts-expect-error Type 'TrextFileResult' !== type 'BabelFileResult'
      mockTransformFileAsync.mockResolvedValue(TFRES)

      // Act
      await TestSubject.trextFile<'js', 'cjs'>(FILENAME, OPTIONS_CJS)

      // Expect
      expect(mockTransformFileAsync).toBeCalledTimes(1)
      expect(mockTransformFileAsync).toBeCalledWith(FILENAME, {
        ...DEFAULTS.babel,
        caller: { name: '@babel/cli' },
        plugins: [[new Trextel().plugin, { ...DEFAULTS, ...OPTIONS_CJS }]]
      })
    })

    it('should throw Error if missing transformation result', async () => {
      // Arrange
      let expected: Error | null = null
      mockTransformFileAsync.mockResolvedValue(null)

      // Act
      try {
        await TestSubject.trextFile<'js', 'cjs'>(FILENAME, OPTIONS_CJS)
      } catch (error) {
        expected = error as Error
      }

      // Expect
      expect(expected).toBeDefined()
      expect(expected?.message).toBe(`Could not compile file ${FILENAME}`)
    })

    it('should call options.to if it is a function', async () => {
      // Arrange
      // @ts-expect-error Type 'TrextFileResult' !== type 'BabelFileResult'
      mockTransformFileAsync.mockResolvedValue(TFRES)
      const options: TrextOptions<'js', 'cjs'> = {
        from: 'js',
        to: jest.fn(() => '.cjs')
      }

      // Act
      await TestSubject.trextFile<'js', 'cjs'>(FILENAME, options)

      // Expect
      expect(options.to).toBeCalledTimes(1)
    })

    it('should create source map and add comment', async () => {
      // Arrange
      // @ts-expect-error Type 'TrextFileResult' !== type 'BabelFileResult'
      mockTransformFileAsync.mockResolvedValue(TFRES)
      const options = {
        ...DEFAULTS,
        ...OPTIONS_CJS,
        babel: { sourceMaps: true },
        pattern: /.js$/
      }

      // Act
      await TestSubject.trextFile<'js', 'cjs'>(FILENAME, options)

      // Expect
      expect(mockAddSourceMap).toBeCalledTimes(1)
      expect(mockAddSourceMap).toBeCalledWith(options, TFRES, {
        input: FILENAME,
        output: FILENAME_CJS
      })
    })

    it('should create file with new extension', async () => {
      // Arrange
      // @ts-expect-error Type 'TrextFileResult' !== type 'BabelFileResult'
      mockTransformFileAsync.mockResolvedValue(TFRES)
      const options = { ...OPTIONS_CJS, pattern: /.js$/ }

      // Act
      await TestSubject.trextFile<'js', 'cjs'>(FILENAME, options)

      // Expect
      expect(mockSaveFile).toBeCalledTimes(1)
      expect(mockSaveFile).toBeCalledWith(FILENAME_CJS, TFRES.code)
      expect(mockFs.chmod).toBeCalledTimes(1)
      expect(mockFs.chmod).toBeCalledWith(FILENAME_CJS, STATS.mode)
      expect(mockFs.unlink).toBeCalledTimes(1)
      expect(mockFs.unlink).toBeCalledWith(FILENAME)
    })
  })
})

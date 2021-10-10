import TFRES, { FILENAME } from '@tests/fixtures/trext-file-result.fixture'
import type { TrextOptions } from '@trext/interfaces'
import type { TrextFileResult } from '@trext/types'
import ignore404 from '@trext/utils/ignore-404.util'
import saveFile from '@trext/utils/save-file.util'
import sourceMappingURL from '@trext/utils/source-mapping-url.util'
import fs from 'fs/promises'
import path from 'path'
import testSubject from '../add-source-map.util'

/**
 * @file Functional Tests - addSourceMap
 * @module trext/utils/tests/unit/addSourceMap
 */

jest.mock('@trext/utils/ignore-404.util')
jest.mock('@trext/utils/save-file.util')
jest.mock('@trext/utils/source-mapping-url.util')
jest.mock('fs/promises')

const mockFs = fs as jest.Mocked<typeof fs>
const mockIgnore404 = ignore404 as jest.MockedFunction<typeof ignore404>
const mockSaveFile = saveFile as jest.MockedFunction<typeof saveFile>
const mockSourceMappingURL = sourceMappingURL as jest.MockedFunction<
  typeof sourceMappingURL
>

describe('functional:utils/addSourceMap', () => {
  const RESULT: TrextFileResult = Object.assign({}, TFRES)

  describe('comments', () => {
    const options: TrextOptions<'js', 'mjs'> = {
      babel: { sourceMaps: true },
      from: 'js',
      to: 'mjs'
    }
    const output = FILENAME.replace(options.from, options.to as string)
    const output_map = `${output}.map`

    beforeEach(async () => {
      await testSubject(options, RESULT, { input: FILENAME, output })
    })

    it('should add source map comment', () => {
      expect(mockSourceMappingURL).toBeCalledTimes(1)
      expect(mockSourceMappingURL).toBeCalledWith(output_map)
    })

    it('should update source map filename', () => {
      expect(RESULT.map.file).toBe(path.basename(output))
    })
  })

  describe('files', () => {
    const OPTIONS: Pick<TrextOptions<'js', 'cjs'>, 'from' | 'to'> = {
      from: 'js',
      to: 'cjs'
    }

    const OUTPUT = FILENAME.replace(OPTIONS.from, OPTIONS.to as string)
    const FILENAMES = { input: FILENAME, output: OUTPUT }

    it('should create source map file with new extension', async () => {
      // Arrange
      const options: TrextOptions<'js', 'cjs'> = {
        ...OPTIONS,
        babel: { sourceMaps: true }
      }

      const output = FILENAME.replace(options.from, options.to as string)
      const output_map = `${output}.map`
      const input_map = `${FILENAME}.map`

      // Act
      await testSubject(options, RESULT, FILENAMES)

      // Expect
      expect(mockSaveFile).toBeCalledTimes(1)
      expect(mockSaveFile).toBeCalledWith(output_map, expect.any(String))
      expect(mockFs.unlink).toBeCalledTimes(1)
      expect(mockFs.unlink).toBeCalledWith(input_map)
      expect(mockIgnore404).toBeCalledTimes(1)
      expect(mockIgnore404).toBeCalledWith(mockFs.unlink(input_map))
    })

    it('should not create file if source map is inline', async () => {
      // Arrange
      const options: TrextOptions<'js', 'cjs'> = {
        ...OPTIONS,
        babel: { sourceMaps: 'inline' as const }
      }

      // Act
      await testSubject(options, RESULT, FILENAMES)

      // Expect
      expect(mockSaveFile).toBeCalledTimes(0)
      expect(mockFs.unlink).toBeCalledTimes(0)
      expect(mockIgnore404).toBeCalledTimes(0)
    })
  })
})

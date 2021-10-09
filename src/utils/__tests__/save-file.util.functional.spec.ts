import fs from 'fs/promises'
import mkdirp from 'mkdirp'
import path from 'path'
import testSubject from '../save-file.util'

/**
 * @file Functional Tests - saveFile
 * @module trext/utils/tests/functional/saveFile
 */

jest.mock('fs/promises')

const mockFs = fs as jest.Mocked<typeof fs>
const mockMkdirp = mkdirp as jest.MockedFunction<typeof mkdirp>

describe('functional:utils/saveFile', () => {
  const FILENAME: string = 'dist/hello-world.mjs'
  const DATA: Buffer = Buffer.from("console.log('Hello, World!')")

  beforeEach(async () => {
    await testSubject(FILENAME, DATA)
  })

  it('should handle directory creation', () => {
    expect(mockMkdirp).toBeCalledTimes(1)
    expect(mockMkdirp).toBeCalledWith(path.dirname(FILENAME))
  })

  it('should create new file', () => {
    expect(mockFs.writeFile).toBeCalledTimes(1)
    expect(mockFs.writeFile).toBeCalledWith(FILENAME, DATA)
  })
})

import type { Testcase } from '@tests/utils/types'
import type { SourceMapComment } from '@trext/types'
import testSubject from '../source-mapping-url.util'

/**
 * @file Unit Tests - sourceMappingURL
 * @module trext/utils/tests/unit/sourceMappingURL
 */

describe('unit:utils/sourceMappingURL', () => {
  type Case = Testcase<SourceMapComment> & {
    filename: string
    ext: string | undefined
  }

  const cases: Case[] = [
    {
      expected: '//# sourceMappingURL=dog.interface.js',
      ext: undefined,
      filename: 'dog.interface.js'
    }
  ]

  const name = "should return source map comment given ['$filename',$ext]"

  it.each<Case>(cases)(name, testcase => {
    // Arrange
    const { expected, ext, filename } = testcase

    // Act + Expect
    expect(testSubject(filename, ext)).toBe(expected)
  })
})

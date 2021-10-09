import ERRNO_EXCEPTION from '@tests/fixtures/errno-exception.fixture'
import ERROR from '@tests/fixtures/error.fixture'
import type { Testcase } from '@tests/utils/types'
import testSubject from '../ignore-404.util'

/**
 * @file Functional Tests - ignore404
 * @module trext/utils/tests/functional/ignore404
 */

describe('functional:utils/ignore404', () => {
  type Case = Testcase<string | undefined> & {
    error: Error | NodeJS.ErrnoException
    throw: 'throw' | 'not throw'
    state: string
  }

  const cases: Case[] = [
    {
      error: ERROR,
      expected: undefined,
      state: 'promise contains Error',
      throw: 'not throw'
    },
    {
      error: ERRNO_EXCEPTION,
      expected: ERRNO_EXCEPTION.code,
      state: 'promise contains NodeJS.ErrnoException',
      throw: 'throw'
    }
  ]

  it.each<Case>(cases)('should $throw if $state', async testcase => {
    // Arrange
    const { error, expected } = testcase
    let exception: NodeJS.ErrnoException | null = null

    // Act
    try {
      await testSubject(new Promise((resolve, reject) => reject(error)))
    } catch (error) {
      exception = error as NodeJS.ErrnoException
    }

    // Expect
    expect(exception?.code).toBe(expected)
  })
})

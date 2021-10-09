import type fs from 'fs/promises'

/**
 * @file Node Module Mock - fs/promises
 * @module tests/mocks/fs/promises
 * @see https://jestjs.io/docs/manual-mocks#mocking-node-modules
 * @see https://jestjs.io/docs/manual-mocks#examples
 * @see https://github.com/nodejs/node/blob/v16.0.0/doc/api/fs.md
 */

export default {
  chmod: jest.fn(),
  stat: jest.fn(),
  unlink: jest.fn(),
  writeFile: jest.fn()
} as jest.Mocked<Partial<typeof fs>>

import { promisify } from 'node:util'

/**
 * @file Node Module Mock - glob
 * @module tests/mocks/glob
 * @see https://jestjs.io/docs/manual-mocks#mocking-node-modules
 * @see https://github.com/isaacs/node-glob
 */

export default jest.fn(async (...args) => {
  return promisify(jest.requireActual('glob').default)(...args)
})

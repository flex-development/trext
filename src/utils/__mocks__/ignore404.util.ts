/**
 * @file User Module Mock - ignore404
 * @module utils/mocks/ignore404
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

export default jest.fn((...args) => {
  return jest.requireActual('../ignore-404.util').default(...args)
})

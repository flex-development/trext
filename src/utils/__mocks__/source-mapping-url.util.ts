/**
 * @file User Module Mock - sourceMappingURL
 * @module utils/mocks/sourceMappingURL
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

export default jest.fn((...args) => {
  return jest.requireActual('../source-mapping-url.util').default(...args)
})

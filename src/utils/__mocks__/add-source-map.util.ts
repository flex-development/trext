/**
 * @file User Module Mock - addSourceMap
 * @module utils/mocks/addSourceMap
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

export default jest.fn((...args) => {
  return jest.requireActual('../add-source-map.util').default(...args)
})

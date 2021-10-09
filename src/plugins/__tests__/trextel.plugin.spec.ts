import TestSubject from '../trextel.plugin'

/**
 * @file Unit Tests - Trextel
 * @module trext/plugins/tests/unit/Trextel
 */

describe('unit:plugins/Trextel', () => {
  const Subject = new TestSubject({ from: 'js', to: 'mjs' })

  describe('get visitor', () => {
    it('should return #CallExpression and #ImportDeclaration', () => {
      expect(Subject.visitor).toMatchObject({
        CallExpression: Subject.CallExpression,
        ImportDeclaration: Subject.ImportDeclaration
      })
    })
  })
})

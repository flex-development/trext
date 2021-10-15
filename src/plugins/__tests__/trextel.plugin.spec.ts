import TestSubject from '../trextel.plugin'

/**
 * @file Unit Tests - Trextel
 * @module trext/plugins/tests/unit/Trextel
 */

describe('unit:plugins/Trextel', () => {
  const Subject = new TestSubject()

  describe('get plugin', () => {
    it('should return plugin object', () => {
      expect(Subject.plugin).toStrictEqual({
        name: Subject.name,
        visitor: Subject.visitor
      })
    })
  })

  describe('get visitor', () => {
    it('should return #CallExpression and #ImportDeclaration', () => {
      expect(Subject.visitor).toStrictEqual({
        CallExpression: Subject.CallExpression,
        ExportAllDeclaration: Subject.ExportAllDeclaration,
        ExportNamedDeclaration: Subject.ExportNamedDeclaration,
        ImportDeclaration: Subject.ImportDeclaration
      })
    })
  })
})

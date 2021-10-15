import { NodePath } from '@babel/traverse'
import {
  callExpression,
  exportNamedDeclaration,
  identifier,
  importDeclaration,
  stringLiteral
} from '@babel/types'
import HUB from '@tests/fixtures/hub.fixture'
import PROGRAM_NODE from '@tests/fixtures/program.fixture'
import type { Testcase } from '@tests/utils/types'
import type { TrextNode, TrextNodeType } from '@trext/types'
import pkg from '../../../package.json'
import TestSubject from '../trextel.plugin'

/**
 * @file Unit Tests - Trextel
 * @module trext/plugins/tests/unit/Trextel
 */

describe('unit:plugins/Trextel', () => {
  const Subject = new TestSubject()

  describe('.getCode', () => {
    type Case = Testcase<string | undefined> & {
      node: TrextNode
      state: `${TrextNodeType} ${'with' | 'without'} ${'1 argument' | 'source'}`
    }

    const cases: Case[] = [
      {
        expected: pkg.name,
        node: callExpression(identifier('require'), [stringLiteral(pkg.name)]),
        state: 'CallExpression with 1 argument'
      },
      {
        expected: undefined,
        node: exportNamedDeclaration(),
        state: 'ExportNamedDeclaration without source'
      },
      {
        expected: './imported.js',
        node: importDeclaration([], stringLiteral('./imported.js')),
        state: 'ImportDeclaration with source'
      }
    ]

    it.each<Case>(cases)('should return $expected given $state', testcase => {
      // Arrange
      const { expected, node } = testcase
      const nodePath = new NodePath<TrextNode>(HUB, PROGRAM_NODE)
      nodePath.node = node
      nodePath.container = PROGRAM_NODE

      // Act + Expect
      expect(TestSubject.getCode(nodePath)).toBe(expected)
    })
  })

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

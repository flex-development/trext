import { Hub, NodePath } from '@babel/traverse'
import type { CallExpression, ImportDeclaration, Node } from '@babel/types'
import {
  callExpression,
  identifier,
  importDeclaration,
  program,
  stringLiteral
} from '@babel/types'
import type { Testcase } from '@tests/utils/types'
import type { TrextOptions } from '@trext/interfaces'
import pkg from '../../../package.json'
import TestSubject from '../trextel.plugin'

/**
 * @file Functional Tests - Trextel
 * @module trext/plugins/tests/functional/Trextel
 */

describe('functional:plugins/Trextel', () => {
  const HUB = new Hub()
  const PROGRAM_NODE = program([])

  describe('#CallExpression', () => {
    type Case = Testcase<Partial<Node>> & {
      _arguments: Parameters<typeof callExpression>[1]
      options: TrextOptions
      state: string
    }

    const cases: Case[] = [
      {
        _arguments: [stringLiteral('./imported')],
        expected: { value: './imported.cjs' },
        options: { from: 'js', to: 'cjs' },
        state: 'add extension to relative require statement'
      },
      {
        _arguments: [stringLiteral('./imported.js')],
        expected: { value: './imported.cjs' },
        options: { from: 'js', to: 'cjs' },
        state: 'change extension in relative require statement'
      },
      {
        _arguments: [stringLiteral(pkg.name)],
        expected: { value: pkg.name },
        options: { from: 'js', to: 'mjs' },
        state: 'not change extension in absolute require statement'
      },
      {
        _arguments: [callExpression(identifier('getPackageName'), [])],
        expected: { arguments: [] },
        options: { from: 'js', to: 'mjs' },
        state: 'not change extension if require is not string literal'
      }
    ]

    it.each<Case>(cases)('should $state', testcase => {
      // Arrange
      const { _arguments, expected, options } = testcase
      const nodePath = new NodePath<CallExpression>(HUB, PROGRAM_NODE)
      nodePath.node = callExpression(identifier('require'), _arguments)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject(options).CallExpression(nodePath)

      // Expect
      expect(nodePath.node.arguments[0]).toMatchObject(expected)
    })
  })

  describe('#ImportDeclaration', () => {
    type Case = Testcase<Partial<Node>> & {
      options: TrextOptions
      source: Parameters<typeof importDeclaration>[1]
      state: string
    }

    const cases: Case[] = [
      {
        expected: { value: './imported.mjs' },
        options: { from: 'js', to: 'mjs' },
        source: stringLiteral('./imported'),
        state: 'add extension to relative import declaration'
      },
      {
        expected: { value: './imported.banana.js' },
        options: { from: 'js', to: 'banana.js' },
        source: stringLiteral('./imported.js'),
        state: 'change extension in relative import declaration'
      },
      {
        expected: { value: pkg.name },
        options: { from: 'js', to: 'cjs' },
        source: stringLiteral(pkg.name),
        state: 'not change extension in absolute import'
      }
    ]

    it.each<Case>(cases)('should $state', testcase => {
      // Arrange
      const { expected, options, source } = testcase
      const nodePath = new NodePath<ImportDeclaration>(HUB, PROGRAM_NODE)
      nodePath.node = importDeclaration([], source)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject(options).ImportDeclaration(nodePath)

      // Expect
      expect(nodePath.node.source).toMatchObject(expected)
    })
  })
})

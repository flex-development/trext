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
import type { TrextelState } from '@trext/interfaces'
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
      do: string
      state: Pick<TrextelState, 'opts'>
    }

    const cases: Case[] = [
      {
        _arguments: [stringLiteral('./imported')],
        do: 'add extension to relative require statement',
        expected: { value: './imported.cjs' },
        state: { opts: { from: 'js', to: 'cjs' } }
      },
      {
        _arguments: [stringLiteral('./imported.js')],
        do: 'change extension in relative require statement',
        expected: { value: './imported.cjs' },
        state: { opts: { from: 'js', to: 'cjs' } }
      },
      {
        _arguments: [stringLiteral(pkg.name)],
        do: 'not change extension in absolute require statement',
        expected: { value: pkg.name },
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        _arguments: [callExpression(identifier('getPackageName'), [])],
        do: 'not change extension if require is not string literal',
        expected: { arguments: [] },
        state: { opts: { from: 'js', to: 'mjs' } }
      }
    ]

    it.each<Case>(cases)('should $do', testcase => {
      // Arrange
      const { _arguments, expected, state } = testcase
      const nodePath = new NodePath<CallExpression>(HUB, PROGRAM_NODE)
      nodePath.node = callExpression(identifier('require'), _arguments)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject().CallExpression(nodePath, state as TrextelState)

      // Expect
      expect(nodePath.node.arguments[0]).toMatchObject(expected)
    })
  })

  describe('#ImportDeclaration', () => {
    type Case = Testcase<Partial<Node>> & {
      do: string
      source: Parameters<typeof importDeclaration>[1]
      state: Pick<TrextelState, 'opts'>
    }

    const cases: Case[] = [
      {
        do: 'add extension to relative import declaration',
        expected: { value: './imported.mjs' },
        source: stringLiteral('./imported'),
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        do: 'change extension in relative import declaration',
        expected: { value: './imported.banana.js' },
        source: stringLiteral('./imported.js'),
        state: { opts: { from: 'js', to: 'banana.js' } }
      },
      {
        do: 'not change extension in absolute import',
        expected: { value: pkg.name },
        source: stringLiteral(pkg.name),
        state: { opts: { from: 'js', to: 'cjs' } }
      }
    ]

    it.each<Case>(cases)('should $do', testcase => {
      // Arrange
      const { expected, source, state } = testcase
      const nodePath = new NodePath<ImportDeclaration>(HUB, PROGRAM_NODE)
      nodePath.node = importDeclaration([], source)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject().ImportDeclaration(nodePath, state as TrextelState)

      // Expect
      expect(nodePath.node.source).toMatchObject(expected)
    })
  })
})

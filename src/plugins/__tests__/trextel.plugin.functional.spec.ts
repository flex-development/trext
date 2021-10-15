import { Hub, NodePath } from '@babel/traverse'
import type {
  CallExpression,
  ExportAllDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
  Node
} from '@babel/types'
import {
  callExpression,
  exportAllDeclaration,
  exportNamedDeclaration,
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
      },
      {
        _arguments: [stringLiteral('../interfaces')],
        do: 'not ignore require statement if require is partial dirix',
        expected: { value: '../interfaces/index.mjs' },
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        _arguments: [stringLiteral('../interfaces')],
        do: 'ignore require statement if require is partial dirix and file extensions are not mandatory',
        expected: { value: '../interfaces' },
        state: { opts: { from: 'js', mandatory: { call: false }, to: 'mjs' } }
      },
      {
        _arguments: [stringLiteral('../utils/index.js')],
        do: 'not ignore require statement if require is full dirix',
        expected: { value: '../utils/index.cjs' },
        state: { opts: { from: 'js', to: 'cjs' } }
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

  describe('#ExportAllDeclaration', () => {
    type Case = Testcase<Partial<Node>> & {
      do: string
      source: Parameters<typeof exportAllDeclaration>[0]
      state: Pick<TrextelState, 'opts'>
    }

    const cases: Case[] = [
      {
        do: 'add extension to relative export all declaration',
        expected: { value: './cat.cjs' },
        source: stringLiteral('./cat'),
        state: { opts: { from: 'js', to: 'cjs' } }
      },
      {
        do: 'change extension in relative export all declaration',
        expected: { value: '../dog.type.mjs' },
        source: stringLiteral('../dog.type.js'),
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        do: 'not change extension in absolute import',
        expected: { value: pkg.name },
        source: stringLiteral(pkg.name),
        state: { opts: { from: 'cjs', to: 'js' } }
      },
      {
        do: 'not ignore export all declaration if export is partial dirix',
        expected: { value: '../plugins/index.cjs' },
        source: stringLiteral('../plugins'),
        state: { opts: { from: 'js', to: 'cjs' } }
      },
      {
        do: 'ignore export all declaration if export is partial dirix and file extensions are not mandatory',
        expected: { value: './config' },
        source: stringLiteral('./config'),
        state: {
          opts: { from: 'js', mandatory: { exportAll: false }, to: 'mjs' }
        }
      },
      {
        do: 'not ignore export all declaration if export is full dirix',
        expected: { value: './interfaces/index.cjs' },
        source: stringLiteral('./interfaces/index.js'),
        state: { opts: { from: 'js', to: 'cjs' } }
      }
    ]

    it.each<Case>(cases)('should $do', testcase => {
      // Arrange
      const { expected, source, state } = testcase
      const nodePath = new NodePath<ExportAllDeclaration>(HUB, PROGRAM_NODE)
      nodePath.node = exportAllDeclaration(source)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject().ExportAllDeclaration(nodePath, state as TrextelState)

      // Expect
      expect(nodePath.node.source).toMatchObject(expected)
    })
  })

  describe('#ExportNamedDeclaration', () => {
    type Case = Testcase<Partial<Node>> & {
      do: string
      source: Parameters<typeof exportNamedDeclaration>[2]
      state: Pick<TrextelState, 'opts'>
    }

    const cases: Case[] = [
      {
        do: 'add extension to relative named export declaration',
        expected: { value: './gecko.mjs' },
        source: stringLiteral('./gecko'),
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        do: 'change extension in relative named export declaration',
        expected: { value: './salamander.type.cjs' },
        source: stringLiteral('./salamander.js'),
        state: { opts: { from: 'js', to: 'type.cjs' } }
      },
      {
        do: 'not change extension in absolute named export',
        expected: { value: pkg.name },
        source: stringLiteral(pkg.name),
        state: { opts: { from: 'mjs', to: 'js' } }
      },
      {
        do: 'not ignore named export declaration if export is partial dirix',
        expected: { value: './plugins/index.cjs' },
        source: stringLiteral('./plugins'),
        state: { opts: { from: 'js', to: 'cjs' } }
      },
      {
        do: 'ignore named export declaration if export is partial dirix and file extensions are not mandatory',
        expected: { value: './config' },
        source: stringLiteral('./config'),
        state: {
          opts: { from: 'js', mandatory: { exportNamed: false }, to: 'mjs' }
        }
      },
      {
        do: 'not ignore named export declaration if export is full dirix',
        expected: { value: '../../../utils/index.mjs' },
        source: stringLiteral('../../../utils/index.mjs'),
        state: { opts: { from: 'js', to: 'mjs' } }
      }
    ]

    it.each<Case>(cases)('should $do', testcase => {
      // Arrange
      const { expected, source, state } = testcase
      const nodePath = new NodePath<ExportNamedDeclaration>(HUB, PROGRAM_NODE)
      nodePath.node = exportNamedDeclaration(null, [], source)
      nodePath.container = PROGRAM_NODE

      // Act
      new TestSubject().ExportNamedDeclaration(nodePath, state as TrextelState)

      // Expect
      expect(nodePath.node.source).toMatchObject(expected)
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
      },
      {
        do: 'not ignore import declaration if import is partial dirix',
        expected: { value: '../../../types/index.mjs' },
        source: stringLiteral('../../../types'),
        state: { opts: { from: 'js', to: 'mjs' } }
      },
      {
        do: 'ignore import declaration if import is partial dirix and file extensions are not mandatory',
        expected: { value: '../types' },
        source: stringLiteral('../types'),
        state: { opts: { from: 'js', mandatory: { import: false }, to: 'mjs' } }
      },
      {
        do: 'not ignore import declaration if import is full dirix',
        expected: { value: './plugins/index.mjs' },
        source: stringLiteral('./plugins/index.js'),
        state: { opts: { from: 'js', to: 'mjs' } }
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

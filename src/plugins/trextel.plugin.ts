import { PluginObj } from '@babel/core'
import { NodePath, Visitor } from '@babel/traverse'
import {
  CallExpression,
  callExpression,
  ExportAllDeclaration,
  exportAllDeclaration,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  ImportDeclaration,
  importDeclaration,
  stringLiteral
} from '@babel/types'
import DEFAULTS from '@trext/config/defaults.config'
import { TrextelState } from '@trext/interfaces'
import type { TrextNodeType } from '@trext/types'
import { TrextNodePath } from '@trext/types'
import { isDirectorySync as isDirectory } from 'path-type'

/**
 * @file Plugins - Trextel
 * @module trext/plugins/Trextel
 */

/**
 * [Babel plugin][1] that transforms import declarations and call expressions.
 *
 * @template F - Old file extension name(s)
 * @template T - New file extension name(s)
 *
 * @implements {PluginObj<TrextelState<F, T>>}
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
class Trextel<F extends string = string, T extends string = string>
  implements PluginObj<TrextelState<F, T>>
{
  /**
   * @readonly
   * @instance
   * @property {TrextelState<F, T>.key} name - Plugin name
   */
  readonly name: TrextelState<F, T>['key'] = 'Trextel'

  /**
   * Escapes special characters in `value`.
   *
   * @param {string} [value=''] - String to escape
   * @return {string} Escaped string
   */
  static escapeSpecials(value: string = ''): string {
    return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replaceAll('-', '\\x2d')
  }

  /**
   * Transforms call expressions and import statements to use `options.to`.
   *
   * @template F - Old file extension name(s)
   * @template T - New file extension name(s)
   *
   * @param {TrextNodePath} nodePath - Current node path
   * @param {TrextelState<F, T>} state - Plugin state
   * @return {void} Nothing when complete
   */
  static transform<F extends string = string, T extends string = string>(
    nodePath: TrextNodePath,
    state: TrextelState<F, T>
  ): TrextNodePath | void {
    // Get node
    let node = nodePath.node
    const {
      arguments: args,
      declaration,
      callee,
      source,
      specifiers,
      type
    } = node as Record<string, any>

    // Get source code
    let code: string = (type === 'CallExpression' ? args[0] : source)?.value

    // Do nothing is missing source code
    if (!code) return

    // Get user options
    const { from, mandatory, src, to } = { ...DEFAULTS, ...state.opts }

    // Ignore directory entry points if mandatory file extensions are disabled
    if (isDirectory(`${src}/${code.match(/\w.+/)?.[0]}`)) {
      const $m = mandatory as Exclude<TrextelState<F, T>, boolean>

      if (mandatory === false) return
      if ($m['call'] === false && type.startsWith('Call')) return
      if ($m['exportAll'] === false && type.startsWith('ExportAll')) return
      if ($m['exportNamed'] === false && type.startsWith('ExportNamed')) return
      if ($m['import'] === false && type.startsWith('Import')) return

      code = `${code}/index`
    }

    // Ignore absolute imports
    if (!/^\./.test(code)) return

    // Get output extension
    let $to = typeof to === 'function' ? to(nodePath) : to
    if (!$to.startsWith('.')) $to = `.${$to}`

    // Ignore already converted extensions
    if (new RegExp(`\.${Trextel.escapeSpecials($to)}$`).test(code)) return

    // Escape special characters in input extension
    const $from = new RegExp(`\.${Trextel.escapeSpecials(from)}$|$`)

    // Create string literal
    const $code = stringLiteral(code.replace($from, $to))

    // Transform call expression or import/export declarations
    switch (type as TrextNodeType) {
      case 'CallExpression':
        node = callExpression(callee, [$code])
        break
      case 'ExportAllDeclaration':
        node = exportAllDeclaration($code)
        break
      case 'ExportNamedDeclaration':
        node = exportNamedDeclaration(declaration, specifiers, $code)
        break
      case 'ImportDeclaration':
        node = importDeclaration(specifiers, $code)
        break
      default:
        break
    }

    // Replace node
    nodePath.replaceWith(node)
  }

  /**
   * Transforms call expressions to use `options.to`.
   *
   * @param {NodePath<CallExpression>} nodePath - Current node path
   * @param {TrextelState<F, T>} state - Plugin state
   * @return {void} Nothing when complete
   */
  CallExpression(
    nodePath: NodePath<CallExpression>,
    state: TrextelState<F, T>
  ): void {
    const { arguments: args, callee } = nodePath.node

    // Filter by callee name and type
    if (callee.type !== 'Identifier' || callee.name !== 'require') return

    // Do nothing for multiple args or if handling a non-string literal
    if (args.length !== 1 || args[0]?.type !== 'StringLiteral') return

    // Transform node
    Trextel.transform(nodePath, state)
  }

  /**
   * Transforms export all (`export *`) declarations to use `options.to`.
   *
   * @param {NodePath<ExportAllDeclaration>} nodePath - Current node path
   * @param {TrextelState<F, T>} state - Plugin state
   * @return {void} Nothing when complete
   */
  ExportAllDeclaration(
    nodePath: NodePath<ExportAllDeclaration>,
    state: TrextelState<F, T>
  ): void {
    Trextel.transform(nodePath, state)
  }

  /**
   * Transforms named export (`export foo`) declarations to use `options.to`.
   *
   * @param {NodePath<ExportNamedDeclaration>} nodePath - Current node path
   * @param {TrextelState<F, T>} state - Plugin state
   * @return {void} Nothing when complete
   */
  ExportNamedDeclaration(
    nodePath: NodePath<ExportNamedDeclaration>,
    state: TrextelState<F, T>
  ): void {
    Trextel.transform(nodePath, state)
  }

  /**
   * Transforms import declarations to use `options.to`.
   *
   * @param {NodePath<ImportDeclaration>} nodePath - Current node path
   * @param {TrextelState<F, T>} state - Plugin state
   * @return {void} Nothing when complete
   */
  ImportDeclaration(
    nodePath: NodePath<ImportDeclaration>,
    state: TrextelState<F, T>
  ): void {
    Trextel.transform(nodePath, state)
  }

  /**
   * Returns the plugin object.
   *
   * @return {PluginObj<TrextelState<F, T>>} Plugin object
   */
  get plugin(): PluginObj<TrextelState<F, T>> {
    return { name: this.name, visitor: this.visitor }
  }

  /**
   * Returns the plugin [visitor][1].
   *
   * @return {Visitor<TrextelState<F, T>>} Plugin visitor
   */
  get visitor(): Visitor<TrextelState<F, T>> {
    return {
      CallExpression: this.CallExpression,
      ExportAllDeclaration: this.ExportAllDeclaration,
      ExportNamedDeclaration: this.ExportNamedDeclaration,
      ImportDeclaration: this.ImportDeclaration
    }
  }
}

export default Trextel

import { PluginObj } from '@babel/core'
import { NodePath, Visitor } from '@babel/traverse'
import {
  CallExpression,
  callExpression,
  ImportDeclaration,
  importDeclaration,
  stringLiteral
} from '@babel/types'
import DEFAULTS from '@trext/config/defaults.config'
import { TrextelState } from '@trext/interfaces'
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
      callee,
      source,
      specifiers,
      type
    } = node as Record<string, any>

    // Get user options
    const { from, src, to } = { ...DEFAULTS, ...state.opts }

    // Get source code
    const code: string = (type === 'CallExpression' ? args[0] : source).value

    // Ignore directory entry points
    if (isDirectory(`${src}${code.slice(code.indexOf('/'))}`)) return

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

    // Transform  call expression or import statement
    switch (type) {
      case 'CallExpression':
        node = callExpression(callee, [$code])
        break
      case 'ImportDeclaration':
        node = importDeclaration(specifiers, $code)
        break
      default:
        break
    }

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
   * Transforms import statements to use `options.to`.
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
      ImportDeclaration: this.ImportDeclaration
    }
  }
}

export default Trextel

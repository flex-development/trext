import { PluginObj } from '@babel/core'
import { NodePath, Visitor } from '@babel/traverse'
import {
  CallExpression,
  callExpression,
  ImportDeclaration,
  importDeclaration,
  stringLiteral
} from '@babel/types'
import { TrextelState } from '@trext/interfaces'

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
    // Get call expression node and callee
    const node = nodePath.node
    const callee = node.callee
    const { name, type } = node.callee as Record<'name' | 'type', string>

    // Filter out callee by name or type
    if (type !== 'Identifier' || name !== 'require') return

    // Get first argument passed
    const nargs = node.arguments
    const arg = nargs[0]

    // Do nothing for multiple args or if handling a non-string literal
    if (nargs.length !== 1 || arg.type !== 'StringLiteral') return

    // Ignore absolute imports
    if (!/^\./.test(arg.value)) return

    // Get output extension
    const to = state.opts.to
    let $to = typeof to === 'function' ? to(nodePath) : to
    if (!$to.startsWith('.')) $to = `.${$to}`

    // Ignore already converted extensions
    if (new RegExp(`\.${Trextel.escapeSpecials($to)}$`).test(arg.value)) return

    // Escape special characters in input extension
    const $from = new RegExp(`\.${Trextel.escapeSpecials(state.opts.from)}$|$`)

    // Transform call expression
    nodePath.replaceWith(
      callExpression(callee, [stringLiteral(arg.value.replace($from, $to))])
    )
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
    // Get import declaration node and source code
    const node = nodePath.node
    const code = node.source.value

    // Ignore absolute imports
    if (!/^\./.test(code)) return

    // Get output extension
    const to = state.opts.to
    let $to = typeof to === 'function' ? to(nodePath) : to
    if (!$to.startsWith('.')) $to = `.${$to}`

    // Ignore already converted extensions
    if (new RegExp(`\.${Trextel.escapeSpecials($to)}$`).test(code)) return

    // Escape special characters in input extension
    const $from = new RegExp(`\.${Trextel.escapeSpecials(state.opts.from)}$|$`)

    // Transform import statement
    nodePath.replaceWith(
      importDeclaration(
        node.specifiers,
        stringLiteral(code.replace($from, $to))
      )
    )
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

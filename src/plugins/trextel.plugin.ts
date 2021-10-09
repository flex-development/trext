import * as babel from '@babel/core'
import { PluginObj, PluginPass } from '@babel/core'
import { NodePath, Visitor } from '@babel/traverse'
import { CallExpression, ImportDeclaration } from '@babel/types'
import { TrextOptions } from '@trext/interfaces'

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
 * @implements {PluginObj<PluginPass>}
 *
 * [1]: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
class Trextel<F extends string = string, T extends string = string>
  implements PluginObj<PluginPass>
{
  /**
   * @readonly
   * @instance
   * @property {RegExp} $from - Input extension with special characters escaped
   */
  readonly $from: RegExp

  /**
   * @readonly
   * @instance
   * @property {typeof babel} core - `@babel/core` library
   */
  readonly core: typeof babel

  /**
   * @readonly
   * @instance
   * @property {TrextOptions<F, T>} core - Trext options
   */
  readonly options: TrextOptions<F, T>

  /**
   * @readonly
   * @instance
   * @property {string} name - Plugin name
   */
  readonly name: string = 'Trextel'

  /**
   * Returns a custom Babel file transformer plugin.
   *
   * @param {TrextOptions<F,T>} options - Trext options
   * @param {typeof babel} [core=babel] - `@babel/core` library
   */
  constructor(options: TrextOptions<F, T>, core: typeof babel = babel) {
    this.$from = new RegExp(`\.${Trextel.escapeSpecials(options.from)}$|$`)
    this.core = core
    this.options = options
  }

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
   * @return {[NodePath<CallExpression>] | []} New node array
   */
  CallExpression(
    nodePath: NodePath<CallExpression>
  ): [NodePath<CallExpression>] | [] {
    // Get call expression node and callee
    const node = nodePath.node
    const callee = node.callee
    const { name, type } = node.callee as Record<'name' | 'type', string>

    // Filter out callee by name or type
    if (type !== 'Identifier' || name !== 'require') return []

    // Get first argument passed
    const nargs = node.arguments
    const arg = nargs[0]

    // Do nothing for multiple args or if handling a non-string literal
    if (nargs.length !== 1 || arg.type !== 'StringLiteral') return []

    // Ignore absolute imports
    if (!/^\./.test(arg.value)) return []

    // Get output extension
    const to = this.options.to
    let $to = typeof to === 'function' ? to(nodePath) : to
    if (!$to.startsWith('.')) $to = `.${$to}`

    // Ignore already converted extensions
    if (new RegExp(`\.${Trextel.escapeSpecials($to)}$`).test(arg.value)) {
      return []
    }

    // Transform call expression
    return nodePath.replaceWith(
      this.core.types.callExpression(callee, [
        this.core.types.stringLiteral(arg.value.replace(this.$from, $to))
      ])
    )
  }

  /**
   * Transforms import statements to use `options.to`.
   *
   * @param {NodePath<ImportDeclaration>} nodePath - Current node path
   * @return {[NodePath<ImportDeclaration>] | []} New node array
   */
  ImportDeclaration(
    nodePath: NodePath<ImportDeclaration>
  ): [NodePath<ImportDeclaration>] | [] {
    // Get import declaration node and source code
    const node = nodePath.node
    const code = node.source.value

    // Ignore absolute imports
    if (!/^\./.test(code)) return []

    // Get output extension
    const to = this.options.to
    let $to = typeof to === 'function' ? to(nodePath) : to
    if (!$to.startsWith('.')) $to = `.${$to}`

    // Ignore already converted extensions
    if (new RegExp(`\.${Trextel.escapeSpecials($to)}$`).test(code)) return []

    // Transform import statement
    return nodePath.replaceWith(
      this.core.types.importDeclaration(
        node.specifiers,
        this.core.types.stringLiteral(code.replace(this.$from, $to))
      )
    )
  }

  /**
   * Returns the plugin [visitor][1].
   *
   * @return {Visitor<PluginPass>} Plugin visitor
   */
  get visitor(): Visitor<PluginPass> {
    return {
      CallExpression: this.CallExpression,
      ImportDeclaration: this.ImportDeclaration
    }
  }
}

export default Trextel

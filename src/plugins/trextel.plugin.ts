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
import { TrextNodePath } from '@trext/types'
import { isDirectorySync as isDirectory } from 'path-type'
import resolve from 'resolve-cwd'

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
   * Retrieves the source code from `nodePath`.
   *
   * @param {TrextNodePath} nodePath - Current node path
   * @return {string | undefined} Declaration, call expression, or `undefined`
   */
  static getCode(nodePath: TrextNodePath): string | undefined {
    // Init source code value
    let code: string | undefined

    // Get source code value based on node type
    switch (nodePath.node.type) {
      case 'CallExpression':
        // @ts-expect-error 'value' does not exist on type 'ArgumentPlaceholder'
        code = nodePath.node.arguments[0]?.value
        break
      default:
        code = nodePath.node.source?.value
        break
    }

    return code
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

    // Get source code
    let code: string | undefined = Trextel.getCode(nodePath)

    // Do nothing is missing source code
    if (!code) return

    // Merge options
    const options = { ...DEFAULTS, ...state.opts }

    // Get user options
    const { absolute, from, mandatory, src, to } = options

    // Check for absolute import
    const absimport = !/^\./.test(code)

    // Ignore absolute imports
    if (absimport) {
      if (absolute === false) return
      if (typeof absolute !== 'boolean' && !absolute.test(code)) return
    }

    // Check for directory entry point
    const directory: boolean = ((): boolean => {
      if (absimport) return !!resolve.silent(`${code}/index`)
      return isDirectory(`${src}/${code.match(/\w.+/)?.[0]}`)
    })()

    // Ignore directory entry points if mandatory file extensions are disabled
    if (directory) {
      const { type } = node
      const $m = mandatory as Exclude<TrextelState<F, T>, boolean>

      if (mandatory === false) return
      if ($m['call'] === false && type.startsWith('Call')) return
      if ($m['exportAll'] === false && type.startsWith('ExportAll')) return
      if ($m['exportNamed'] === false && type.startsWith('ExportNamed')) return
      if ($m['import'] === false && type.startsWith('Import')) return

      code = `${code}/index`
    } else if (absimport && resolve.silent(`${code}/package.json`)) return

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
    switch (node.type) {
      case 'CallExpression':
        node = callExpression(node.callee, [$code])
        break
      case 'ExportAllDeclaration':
        node = exportAllDeclaration($code)
        break
      case 'ExportNamedDeclaration':
        node = exportNamedDeclaration(node.declaration, node.specifiers, $code)
        break
      case 'ImportDeclaration':
        node = importDeclaration(node.specifiers, $code)
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

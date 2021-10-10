import type { PluginPass } from '@babel/core'
import type TrextOptions from './trext-options.interface'

/**
 * @file Type Definitions - TrextelState
 * @module trext/types/TrextelState
 */

/**
 * `Trextel` plugin state.
 *
 * @template F - Old file extension name(s)
 * @template T - New file extension name(s)
 *
 * @extends {PluginPass}
 */
interface TrextelState<F extends string = string, T extends string = string>
  extends PluginPass {
  filename: string
  key: 'Trextel'
  opts: TrextOptions<F, T> & { $from?: string }
}

export default TrextelState

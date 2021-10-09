import logger from '@flex-development/grease/utils/logger.util'
import LogLevel from '@flex-development/log/enums/log-level.enum'
import type { ChildProcess } from 'child_process'
import sh from 'shelljs'

/**
 * @file Helpers - Shell Command Executor
 * @module tools/helpers/exec
 */

/**
 * Executes a shell command or logs the command that would be run.
 *
 * @param {string} command - Command
 * @param {boolean} [dryRun=false] - Log command that would be run
 * @param {sh.ExecOptions} [options={silent:true}] - `sh.exec` options
 * @return {string | void} Command output, command, or nothing
 * @throws {Error}
 */
const exec = (
  command: string,
  dryRun: boolean = false,
  options: sh.ExecOptions = {}
): string => {
  // Format command
  command = command.trim()

  // Set default options
  if (options.silent === undefined) options.silent = true

  // Command output
  let stdout: ChildProcess | sh.ShellString | null = null

  // Log command during dry runs, execute command otherwise
  if (dryRun) logger({}, command, [], LogLevel.WARN)
  else stdout = sh.exec(command, options) as sh.ShellString | null

  // Throw Exception if error executing command
  if (stdout && stdout.code !== 0) {
    const error = new Error((stdout.stderr || stdout.stdout).toString())
    ;(error as any).code = stdout.code

    throw error
  }

  // Format command output or return original command
  return stdout && stdout.length > 0 ? stdout.toString() : command
}

export default exec

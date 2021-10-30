declare module 'tsc-prog/dist/utils/log' {
  import type { Diagnostic } from 'typescript'

  const logDiagnostics: (diagnostics: Diagnostic[], pretty?: boolean) => void

  export { logDiagnostics }
}

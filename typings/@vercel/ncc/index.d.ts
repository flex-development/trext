declare module '@vercel/ncc' {
  import type { NumberString } from '@flex-development/tutils'

  export type NccOptions = {
    /**
     * Build assets (including those in `existingAssetNames`) with `ncc`.
     *
     * @default false
     */
    assetBuilds?: boolean

    /**
     * Path to custom cache directory or `false` to disable caching.
     */
    cache?: string | false

    /**
     * [Custom functional asset emitter][1].
     *
     * [1]: https://github.com/vercel/webpack-asset-relocator-loader#usage-1
     *
     * @default undefined
     */
    customEmit?: (
      path: string,
      context: { id: string; isRequire: boolean }
    ) => false | string

    /**
     * Enable debug logging.
     *
     * @default false
     */
    debugLog?: boolean

    /**
     * Enable ES module output.
     *
     * If building a `.mjs` or `.js` module inside a `"type": "module"` [package
     * boundary][1], an ES module output will be created automatically.
     *
     * [1]: https://nodejs.org/api/packages.html#packages_package_json_and_file_extensions
     */
    esm?: boolean

    /**
     * Names of existing build assets.
     */
    existingAssetNames?: string[]

    /**
     * Dependencies to leave as requires of the build.
     *
     * @default []
     */
    externals?: string[]

    /**
     * Bundle filename.
     *
     * @default index.(cjs|js|mjs)
     */
    filename?: string

    /**
     * Directory outside of which never to emit assets.
     *
     * @default process.cwd()
     */
    filterAssetBase?: string

    /**
     * Name of file containing licensing information.
     *
     * @default ''
     */
    license?: string

    /**
     * Use [`terser`][1] to mangle and compress build output.
     *
     * [1]: https://github.com/terser/terser
     *
     * @default false
     */
    minify?: boolean

    /**
     * Create bundle for production environment.
     *
     * @default false
     */
    production?: boolean

    /**
     * Disable logging.
     *
     * @default false
     */
    quiet?: boolean

    /**
     * Enable source mapping.
     *
     * @default false
     */
    sourceMap?: boolean

    /**
     * Base directory prefix. Use to create `;// CONCATENATED MODULE:` comments.
     *
     * The default treats sources as output-relative.
     *
     * @default '../'
     */
    sourceMapBasePrefix?: string

    /**
     * When outputting a sourcemap, include [`source-map-support`][1] in the
     * output file (increases output by `32kB`).
     *
     * [1]: https://github.com/evanw/node-source-map-support
     *
     * @default true
     */
    sourceMapRegister?: boolean

    /**
     * Build [target][1].
     *
     * [1]: https://www.typescriptlang.org/tsconfig#target
     */
    target?: `es${number | 'next'}`

    /**
     * Disable type-checking.
     *
     * @default false
     */
    transpileOnly?: boolean

    /**
     * Use the [v8 cache]. Not supported for ES modules.
     *
     * [1]: https://nodejs.org/api/vm.html#scriptcreatecacheddata
     *
     * @default false
     */
    v8cache?: boolean

    /**
     * Rebuild project when changes to the input entry are detected.
     *
     * @default false
     */
    watch?: boolean
  }

  export type NccBuild = {
    /**
     * Emitted assets map.
     */
    assets: Record<string, { permissions: NumberString; source: string }>

    /**
     * Bundle output.
     */
    code: string

    /**
     * Stringified sourcemap.
     */
    map: string | undefined
  }

  export type NccWatcher = {
    /**
     * Close the watcher.
     */
    close(): void

    /**
     * Handler re-run on each build completion.
     *
     * Watch errors are reported on `err`.
     */
    handler(context: {
      assets: NccBuild['assets']
      code: NccBuild['code']
      err: Error
      map: NccBuild['map']
    }): void

    /**
     * Handler re-run on each rebuild start.
     */
    rebuild(): void
  }

  export type NccResult<O extends NccOptions | undefined = NccOptions> =
    NonNullable<O>['watch'] extends true ? NccWatcher : NccBuild

  export default function (
    entry: string,
    options?: NccOptions
  ): Promise<NccResult<typeof options>>
}

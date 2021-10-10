/**
 * @file ESLint Configuration - Base
 * @see https://eslint.org/docs/user-guide/configuring
 */

module.exports = {
  env: {
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended'
  ],
  globals: {},
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    babelOptions: {},
    ecmaFeatures: {
      impliedStrict: true
    },
    extraFileExtensions: ['.cjs', '.mjs'],
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: true
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'jsdoc',
    'markdown',
    'spellcheck',
    'tree-shaking',
    'unicorn'
  ],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/ban-types': 1,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/no-var-requires': 1,
    eqeqeq: 1,
    'import/no-anonymous-default-export': 0,
    'jsdoc/check-indentation': 1,
    'jsdoc/check-line-alignment': 1,
    'jsdoc/check-syntax': 1,
    'jsdoc/check-tag-names': [1, { definedTags: ['link'] }],
    'jsdoc/no-multi-asterisks': 0,
    'jsdoc/no-undefined-types': [
      1,
      {
        definedTypes: ['NodeJS', 'never', 'unknown']
      }
    ],
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-throws': 1,
    'jsdoc/tag-lines': [
      1,
      'any',
      {
        count: 1,
        noEndLines: false,
        tags: {}
      }
    ],
    'no-ex-assign': 0,
    'prefer-arrow-callback': 2,
    'prettier/prettier': [2, require('./.prettierrc.cjs')],
    'sort-keys': [
      1,
      'asc',
      {
        caseSensitive: true,
        minKeys: 2,
        natural: true
      }
    ],
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'spellcheck/spell-checker': [
      2,
      {
        comments: true,
        identifiers: false,
        lang: 'en_US',
        minLength: 3,
        skipIfMatch: [],
        skipWordIfMatch: [],
        skipWords: [
          'argv',
          'basedir',
          'cjs',
          'commonjs',
          'dotenv',
          'esm',
          'extensionless',
          'keyof',
          'loadenv',
          'mjs',
          'perf',
          'pkgfile',
          'pnv',
          'postinstall',
          'prepack',
          'readonly',
          'rimraf',
          'tgz',
          'tsc',
          'tsconfig',
          'ttsc',
          'typeof',
          'usr',
          'utf',
          'wasm',
          'wip',
          'yargs'
        ],
        strings: true
      }
    ],
    'unicorn/consistent-function-scoping': 2,
    'unicorn/custom-error-definition': 2,
    'unicorn/filename-case': [
      2,
      {
        cases: { kebabCase: true },
        ignore: [/^.md/i]
      }
    ],
    'unicorn/import-index': 2,
    'unicorn/import-style': [
      2,
      {
        styles: {
          shelljs: { default: true }
        }
      }
    ],
    'unicorn/explicit-length-check': 2,
    'unicorn/new-for-builtins': 2,
    'unicorn/no-abusive-eslint-disable': 2,
    'unicorn/no-array-callback-reference': 2,
    'unicorn/no-array-for-each': 2,
    'unicorn/no-array-method-this-argument': 2,
    'unicorn/no-array-push-push': 2,
    'unicorn/no-array-reduce': 2,
    'unicorn/no-for-loop': 2,
    'unicorn/no-instanceof-array': 2,
    'unicorn/no-lonely-if': 2,
    'unicorn/no-new-array': 2,
    'unicorn/no-new-buffer': 2,
    'unicorn/no-object-as-default-parameter': 2,
    'unicorn/no-this-assignment': 2,
    'unicorn/no-unsafe-regex': 2,
    'unicorn/no-unused-properties': 2,
    'unicorn/no-useless-fallback-in-spread': 2,
    'unicorn/no-useless-length-check': 2,
    'unicorn/no-useless-spread': 2,
    'unicorn/no-useless-undefined': 2,
    'unicorn/no-zero-fractions': 2,
    'unicorn/number-literal-case': 2,
    'unicorn/numeric-separators-style': 2,
    'unicorn/prefer-array-find': 2,
    'unicorn/prefer-array-flat-map': 2,
    'unicorn/prefer-array-index-of': 2,
    'unicorn/prefer-array-some': 2,
    'unicorn/prefer-default-parameters': 2,
    'unicorn/prefer-includes': 2,
    'unicorn/prefer-module': 2,
    'unicorn/prefer-number-properties': 2,
    'unicorn/prefer-object-from-entries': [
      2,
      {
        functions: ['fromPairs']
      }
    ],
    'unicorn/prefer-object-has-own': 2,
    'unicorn/prefer-optional-catch-binding': 2,
    'unicorn/prefer-prototype-methods': 2,
    'unicorn/prefer-regexp-test': 2,
    'unicorn/prefer-set-has': 2,
    'unicorn/prefer-spread': 2,
    'unicorn/prefer-string-replace-all': 2,
    'unicorn/prefer-string-slice': 2,
    'unicorn/prefer-string-starts-ends-with': 2,
    'unicorn/prefer-string-trim-start-end': 2,
    'unicorn/prefer-switch': 2,
    'unicorn/prefer-ternary': 2,
    'unicorn/prefer-type-error': 2,
    'unicorn/throw-new-error': 2
  },
  overrides: [
    {
      files: ['*.cjs', '**/*.md/*.js'],
      parser: `${__dirname}/node_modules/@babel/eslint-parser/lib/index.cjs`,
      parserOptions: {
        requireConfigFile: false
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-var-requires': 0
      }
    },
    {
      files: ['*.cjs'],
      rules: {
        'unicorn/prefer-module': 0
      }
    },
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown'
    },
    {
      files: ['**/*.md/*.ts'],
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      files: ['**/*.spec.ts'],
      env: {
        jest: true
      },
      extends: ['plugin:jest/recommended'],
      globals: {
        'jest/globals': true
      },
      rules: {
        'jest/no-disabled-tests': 0,
        'jest/valid-title': 0,
        'tree-shaking/no-side-effects-in-initialization': 0
      }
    },
    {
      files: ['**/.eslintrc.*'],
      rules: {
        'sort-keys': 0,
        'spellcheck/spell-checker': 0
      }
    },
    {
      files: [
        '**/__mocks__/**',
        '**/__tests__/**',
        '**/tools/**',
        '*.cjs',
        'jest.config.*'
      ],
      rules: {
        'tree-shaking/no-side-effects-in-initialization': 0
      }
    },
    {
      files: ['**/typings/**'],
      rules: {
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/triple-slash-reference': 0,
        'unicorn/filename-case': 0
      }
    },
    {
      files: ['tools/loaders/env.cjs'],
      rules: {
        'unicorn/no-array-reduce': 0
      }
    }
  ],
  root: true,
  settings: {
    'import/parsers': {
      [require.resolve('@typescript-eslint/parser')]: ['.d.ts', '.ts']
    },
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {
        extensions: ['.ts']
      },
      [require.resolve('eslint-import-resolver-typescript')]: {
        alwaysTryTypes: true
      }
    },
    jsdoc: {
      augmentsExtendsReplacesDocs: true,
      implementsReplacesDocs: true,
      mode: 'typescript',
      overrideReplacesDocs: true,
      structuredTags: {
        param: {
          required: ['name', 'type']
        },
        throws: {
          name: 'namepath-defining',
          required: ['type']
        }
      },
      tagNamePreference: {
        augments: 'extends',
        constant: 'const',
        returns: 'return'
      }
    }
  }
}

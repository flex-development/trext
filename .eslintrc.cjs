const { overrides, rules } = require('./.eslintrc.base.cjs')

/**
 * @file ESLint Configuration - Root
 * @see https://eslint.org/docs/user-guide/configuring
 */

const RULES_SPELLCHECKER = rules['spellcheck/spell-checker']

module.exports = {
  root: true,
  extends: ['./.eslintrc.base.cjs'],
  rules: {
    'spellcheck/spell-checker': [
      RULES_SPELLCHECKER[0],
      {
        ...RULES_SPELLCHECKER[1],
        skipWords: [
          ...RULES_SPELLCHECKER[1].skipWords,
          'callee',
          'cts',
          'direxts',
          'dirix',
          'errno',
          'filenames',
          'jsx',
          'mts',
          'promisify',
          'symlinks',
          'trext',
          'trextel',
          'tsx',
          'tutils'
        ]
      }
    ]
  },
  overrides: [
    ...overrides,
    {
      files: [
        '__tests__/__fixtures__/trext-file-result.fixture.ts',
        'src/plugins/trextel.plugin.ts'
      ],
      rules: {
        'no-useless-escape': 0
      }
    },
    {
      files: ['docs/examples/dynamic.example.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 0
      }
    }
  ]
}

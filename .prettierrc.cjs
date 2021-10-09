/**
 * @file Prettier Configuration
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://prettier.io/docs/en/options.html
 * @see https://github.com/rx-ts/prettier/tree/master/packages/sh
 */

module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  printWidth: 80,
  proseWrap: 'always',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.sh',
      options: {
        functionNextLine: true,
        indent: 4,
        keepComments: true,
        keepPadding: false,
        parser: 'sh',
        spaceRedirects: true,
        switchCaseIndent: true,
        variant: 0
      }
    }
  ]
}

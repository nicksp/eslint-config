import { pluginUnicorn } from '../plugins'

import type { Config, OptionsOverrides } from '../types'

const COMMUNITY_HEALTH_MARKDOWN_REGEX = [
  String.raw`README\.md$`,
  String.raw`CODE_OF_CONDUCT\.md$`,
  String.raw`CONTRIBUTING\.md$`,
  String.raw`FUNDING\.yml$`,
  String.raw`GOVERNANCE\.md$`,
  String.raw`SECURITY\.md$`,
  String.raw`SUPPORT\.md$`,
  String.raw`CHANGELOG.*\.md$`,
  'LICENSE.*$',
]

export async function unicorn(
  options: OptionsOverrides = {},
): Promise<Config[]> {
  const { overrides = {} } = options

  return [
    {
      ...pluginUnicorn.configs.unopinionated,
      name: 'nicksp/unicorn/unopinionated',
    },
    {
      name: 'nicksp/unicorn/rules',
      rules: {
        'unicorn/consistent-empty-array-spread': 'error',
        'unicorn/consistent-function-scoping': [
          'error',
          { checkArrowFunctions: false },
        ],
        'unicorn/custom-error-definition': 'error',
        'unicorn/filename-case': [
          'error',
          {
            cases: { kebabCase: true, pascalCase: true },
            ignore: [...COMMUNITY_HEALTH_MARKDOWN_REGEX],
          },
        ],
        'unicorn/import-style': 'off',
        'unicorn/no-for-loop': 'error',
        'unicorn/no-process-exit': 'off',
        'unicorn/no-useless-undefined': [
          'error',
          { checkArguments: false, checkArrowFunctionBody: false },
        ],
        'unicorn/prefer-global-this': 'off',
        'unicorn/prefer-query-selector': 'error',
        // Array.includes() might still be fine for short arrays
        'unicorn/prefer-set-has': 'off',
        'unicorn/prefer-ternary': 'off',
        // Top level await is not supported in all environments
        'unicorn/prefer-top-level-await': 'off',
        // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2710
        'unicorn/require-module-specifiers': 'off',

        ...overrides,
      },
    },
  ]
}

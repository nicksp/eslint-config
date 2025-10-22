import { GLOB_TESTS } from '../globs'
import { pluginNoOnlyTests, pluginVitest } from '../plugins'

import type {
  Config,
  OptionsFiles,
  OptionsIsInEditor,
  OptionsOverrides,
} from '../types'

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any

export function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Config[] {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options

  _pluginTest = Boolean(_pluginTest) || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules,
    },
  }

  return [
    {
      name: 'nicksp/test/setup',
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: 'nicksp/test/rules',
      rules: {
        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/no-only-tests': isInEditor ? 'warn' : 'error',
        'test/padding-around-all': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': [
          'error',
          {
            ignore: ['describe'],
          },
        ],

        ...overrides,
      },
    },
  ]
}

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
        // Consistently use *.test.ts instead of .spec.ts
        'test/consistent-test-filename': [
          'error',
          { pattern: String.raw`.*\.test\.[tj]sx?$` },
        ],
        // Consistently use it() instead of test()
        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        // Consistently use vi.* instead of vitest.*
        'test/consistent-vitest-vi': 'error',
        // Disallow focused tests such as test.only()
        'test/no-focused-tests': isInEditor ? 'warn' : 'error',
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        // Enforce padding around vitest functions except for padding-around-expect-groups
        'test/padding-around-after-all-blocks': isInEditor ? 'warn' : 'error',
        'test/padding-around-after-each-blocks': isInEditor ? 'warn' : 'error',
        'test/padding-around-before-all-blocks': isInEditor ? 'warn' : 'error',
        'test/padding-around-before-each-blocks': isInEditor ? 'warn' : 'error',
        'test/padding-around-describe-blocks': isInEditor ? 'warn' : 'error',
        'test/padding-around-test-blocks': isInEditor ? 'warn' : 'error',
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

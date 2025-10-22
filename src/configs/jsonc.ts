import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'
import { parserJsonc, pluginJsonc } from '../plugins'

import type { Linter } from 'eslint'
import type { Config } from '../types'

export function jsonc(): Config[] {
  const files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC]

  return [
    {
      name: 'nicksp/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'nicksp/jsonc/rules',
      rules: {
        ...(pluginJsonc.configs['recommended-with-jsonc']
          .rules as Linter.RulesRecord),
        'jsonc/no-octal-escape': 'error',
        'jsonc/quote-props': 'off',
        'jsonc/quotes': 'off',
      },
    },
  ]
}

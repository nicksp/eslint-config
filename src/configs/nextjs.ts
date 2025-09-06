import { GLOB_SRC } from '../globs'
import { pluginNextJs } from '../plugins'
import { ensurePackages } from '../utils'

import type { Linter } from 'eslint'
import type { Config, OptionsFiles, OptionsOverrides } from '../types'

export async function nextjs(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<Config[]> {
  const { files = [GLOB_SRC], overrides = {} } = options

  await ensurePackages(['@next/eslint-plugin-next'])

  return [
    {
      name: 'nicksp/nextjs/setup',
      plugins: {
        '@next/next': pluginNextJs,
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'nicksp/nextjs/rules',
      rules: {
        ...(pluginNextJs.configs.recommended.rules as Linter.RulesRecord),
        ...(pluginNextJs.configs['core-web-vitals']
          .rules as Linter.RulesRecord),

        ...overrides,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ]
}

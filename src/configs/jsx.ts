import { GLOB_JSX, GLOB_TSX } from '../globs'
import { jsxA11yPlugin } from '../plugins'
import { ensurePackages } from '../utils'

import type { Config, OptionsJSX } from '../types'

export async function jsx(options: OptionsJSX = {}): Promise<Config[]> {
  const { a11y } = options

  // Base JSX configuration without a11y
  const baseConfig: Config = {
    files: [GLOB_JSX, GLOB_TSX],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: 'nicksp/jsx/setup',
    plugins: {},
    rules: {},
  }

  // Return early if no a11y configuration is needed
  if (!a11y) {
    return [baseConfig]
  }

  await ensurePackages(['eslint-plugin-jsx-a11y'])
  const a11yConfig = jsxA11yPlugin.flatConfigs.recommended

  const a11yRules = {
    ...a11yConfig.rules,
    ...(typeof a11y === 'object' && a11y.overrides ? a11y.overrides : {}),
  }

  // Merge base config with a11y configuration
  return [
    {
      ...baseConfig,
      ...a11yConfig,
      files: baseConfig.files,
      languageOptions: {
        ...baseConfig.languageOptions,
        ...a11yConfig.languageOptions,
      },
      name: baseConfig.name,
      plugins: {
        ...baseConfig.plugins,
        'jsx-a11y': jsxA11yPlugin,
      },
      rules: {
        ...baseConfig.rules,
        ...a11yRules,
      },
    },
  ]
}

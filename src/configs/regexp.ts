import { configs } from 'eslint-plugin-regexp'

import type { Config, OptionsOverrides, OptionsRegExp } from '../types'

export async function regexp(
  options: OptionsRegExp & OptionsOverrides = {},
): Promise<Config[]> {
  const config = configs['flat/recommended'] as Config

  const rules = {
    ...config.rules,
  }

  if (options.level === 'warn') {
    for (const [key, value] of Object.entries(rules)) {
      if (value === 'error') {
        rules[key] = 'warn'
      }
    }
  }

  return [
    {
      ...config,
      name: 'nicksp/regexp/rules',
      rules: {
        ...rules,
        ...options.overrides,
      },
    },
  ]
}

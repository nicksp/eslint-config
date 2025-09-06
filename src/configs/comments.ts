import { pluginComments } from '../plugins'

import type { Config } from '../types'

export async function comments(): Promise<Config[]> {
  return [
    {
      name: 'nicksp/comments/recommended',
      plugins: {
        '@eslint-community/eslint-comments': pluginComments,
      },
      rules: {
        ...pluginComments.configs.recommended.rules,
      },
    },
    {
      name: 'nicksp/comments/rules',
      rules: {
        '@eslint-community/eslint-comments/disable-enable-pair': [
          'error',
          { allowWholeFile: true },
        ],
      },
    },
  ]
}

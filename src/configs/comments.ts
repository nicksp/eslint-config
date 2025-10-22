import { configComments } from '../plugins'

import type { Config } from '../types'

export function comments(): Config[] {
  return [
    {
      ...configComments.recommended,
      name: 'nicksp/comments/recommended',
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
  ] as Config[]
}

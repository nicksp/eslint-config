import { pluginNode } from '../plugins'

import type { Config } from '../types'

export function node(): Config[] {
  return [
    {
      name: 'nicksp/node/rules',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/hashbang': 'error',
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-extraneous-import': 'error',
        'node/no-extraneous-require': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/no-process-env': [
          'error',
          {
            allowedVariables: ['NODE_ENV'],
          },
        ],
        'node/no-unpublished-bin': 'error',
        'node/no-unpublished-import': 'error',
        'node/no-unpublished-require': 'error',
        'node/no-unsupported-features/es-builtins': 'error',
        'node/no-unsupported-features/es-syntax': [
          'error',
          { ignores: ['modules'] },
        ],
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'never'],
        'node/process-exit-as-throw': 'error',
      },
    },
  ]
}

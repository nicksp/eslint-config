import { GLOB_SRC, GLOB_SRC_EXT, GLOB_TESTS } from '../globs'

import type { Config } from '../types'

export async function disables(): Promise<Config[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: 'nicksp/disables/scripts',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'nicksp/disables/bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'nicksp/disables/dts',
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: GLOB_TESTS,
      name: 'nicksp/disables/tests',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'antfu/no-top-level-await': 'off',
        'no-unused-expressions': 'off',
        'node/prefer-global/process': 'off',
        'unicorn/consistent-function-scoping': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'nicksp/disables/cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: 'nicksp/disables/config-files',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'antfu/no-top-level-await': 'off',
        'no-console': 'off',
      },
    },
  ]
}

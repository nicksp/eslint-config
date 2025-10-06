import { GLOB_YAML } from '../globs'
import { parserYaml, pluginYaml } from '../plugins'

import type { Linter } from 'eslint'
import type { Config, OptionsFiles, OptionsOverrides } from '../types'

export async function yaml(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<Config[]> {
  const { files = [GLOB_YAML], overrides = {} } = options

  return [
    {
      name: 'nicksp/yaml/setup',
      plugins: {
        yml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'nicksp/yaml/rules',
      rules: {
        ...(pluginYaml.configs.standard.rules as Linter.RulesRecord),
        ...(pluginYaml.configs.prettier.rules as Linter.RulesRecord),

        ...overrides,
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      name: 'nicksp/yaml/pnpm-workspace',
      rules: {
        'yml/sort-keys': [
          'error',
          {
            order: [
              'packages',
              'overrides',
              'patchedDependencies',
              'hoistPattern',
              'catalog',
              'catalogs',

              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'packageExtensions',
              'peerDependencyRules',
              'supportedArchitectures',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '.*',
          },
        ],
      },
    },
  ]
}

import { GLOB_ASTRO } from '../globs'
import { pluginAntfu } from '../plugins'
import { ensurePackages, interopDefault, isPackageInScope } from '../utils'

import type {
  Config,
  OptionsEnableAstro,
  OptionsOverrides,
  OptionsPrettierOptions,
} from '../types'
import type { Options as PrettierOptions } from 'prettier'

export async function prettier(
  options: OptionsPrettierOptions & OptionsOverrides & OptionsEnableAstro = {},
): Promise<Config[]> {
  const {
    enableAstro = isPackageInScope('prettier-plugin-astro'),
    options: prettierOptions = {},
  } = options

  await ensurePackages([
    '@nicksp/prettier-config',
    enableAstro ? 'prettier-plugin-astro' : undefined,
  ])

  const [pluginPrettier, pluginPrettierRecommended] = await Promise.all([
    interopDefault(import('eslint-plugin-prettier')),
    interopDefault(import('eslint-plugin-prettier/recommended')),
  ])

  const defaultPrettierOptions = await import('@nicksp/prettier-config')

  // Merge defaults with user overrides
  const finalPrettierOptions: PrettierOptions = {
    ...defaultPrettierOptions,
    ...prettierOptions,
  }

  const configs: Config[] = [
    {
      name: 'nicksp/prettier/setup',
      plugins: {
        antfu: pluginAntfu,
        prettier: pluginPrettier,
      },
    },
  ]

  if (enableAstro) {
    configs.push({
      files: [GLOB_ASTRO],
      name: 'nicksp/prettier/astro',
      rules: {
        'prettier/prettier': [
          'warn',
          {
            ...finalPrettierOptions,
            parser: 'astro',
            plugins: ['prettier-plugin-astro'],
          },
        ],
      },
    })
  }

  configs.push({
    name: 'nicksp/prettier/rules',
    rules: {
      ...pluginPrettierRecommended.rules,

      // Extra stylistic formatting
      'antfu/consistent-chaining': 'error',
      'antfu/consistent-list-newline': 'error',
      'antfu/top-level-function': 'error',
      curly: ['error', 'all'],

      'prettier/prettier': ['warn', finalPrettierOptions],
    },
  })

  return configs
}

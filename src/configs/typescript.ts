import { defineConfig } from 'eslint/config'

import { GLOB_JS, GLOB_TS, GLOB_TSX } from '../globs'
import { pluginErasableSyntaxOnly, tseslint } from '../plugins'
import { restrictedSyntaxJs } from './javascript'

import type {
  Config,
  OptionsFiles,
  OptionsOverrides,
  OptionsProjectType,
} from '../types'

function extractRules(configs: Config[]): Config['rules'] {
  const allRules: Config['rules'] = {}

  for (const config of configs) {
    if (config.rules) {
      Object.assign(allRules, config.rules)
    }
  }

  return allRules
}

export const typescriptRecommended: Config[] = defineConfig(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
) as any

export async function typescript(
  options: OptionsFiles & OptionsOverrides & OptionsProjectType = {},
): Promise<Config[]> {
  const { overrides = {}, type = 'app' } = options

  const files = options.files ?? [GLOB_TS, GLOB_TSX]

  const recommendedRules = extractRules(typescriptRecommended as any)

  return [
    {
      languageOptions: {
        parser: tseslint.parser,
      },
      name: 'nicksp/typescript/setup',
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        'erasable-syntax-only': pluginErasableSyntaxOnly,
      },
    },
    {
      files,
      name: 'nicksp/typescript/recommended',
      rules: {
        ...recommendedRules,
      },
    },
    {
      files,
      name: 'nicksp/typescript/rules',
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-expect-error': 'allow-with-description' },
        ],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow-as-parameter',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-empty-object-type': [
          'error',
          { allowInterfaces: 'with-single-extends' },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        // handled by unused-imports/no-unused-imports
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { classes: false, functions: false, variables: true },
        ],
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-useless-empty-export': 'error',
        '@typescript-eslint/prefer-as-const': 'warn',
        '@typescript-eslint/prefer-literal-enum-member': [
          'error',
          { allowBitwiseExpressions: true },
        ],
        'no-dupe-class-members': 'off',
        'no-redeclare': 'off',
        'no-restricted-syntax': [
          'error',
          ...restrictedSyntaxJs,
          'TSEnumDeclaration[const=true]',
        ],
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',

        ...pluginErasableSyntaxOnly.configs.recommended.rules,

        ...(type === 'lib'
          ? {
              '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                  allowExpressions: true,
                  allowHigherOrderFunctions: true,
                  allowIIFEs: true,
                },
              ],
            }
          : {}),

        ...overrides,
      },
    },

    {
      files: ['**/*.d.ts'],
      name: 'nicksp/typescript/dts-rules',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },

    {
      files: [GLOB_JS, '**/*.cjs'],
      name: 'nicksp/typescript/cjs-rules',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ]
}

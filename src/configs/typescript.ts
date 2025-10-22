import process from 'node:process'
import { defineConfig } from 'eslint/config'

import {
  GLOB_ASTRO_TS,
  GLOB_JS,
  GLOB_MARKDOWN,
  GLOB_TS,
  GLOB_TSX,
} from '../globs'
import { pluginErasableSyntaxOnly, tseslint } from '../plugins'
import { restrictedSyntaxJs } from './javascript'

import type {
  Config,
  OptionsFiles,
  OptionsProjectType,
  OptionsTypescript,
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
)
const recommendedRules = extractRules(typescriptRecommended)

export const typescriptTypeCheckedRecommended: Config[] = defineConfig(
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
)
const recommendedTypeCheckedRules = extractRules(
  typescriptTypeCheckedRecommended,
)

export function typescript(
  options: OptionsTypescript & OptionsFiles & OptionsProjectType = {},
): Config[] {
  const {
    overrides = {},
    overridesTypeAware = {},
    type = 'app',
    typeAware,
  } = options

  const files = options.files ?? [GLOB_TS, GLOB_TSX]

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ]
  const typeAwareRules: Config['rules'] = {
    '@typescript-eslint/consistent-type-exports': [
      'error',
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      { allowNullableBoolean: true, allowNullableObject: true },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  }

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): Config {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['*.js'],
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
        },
        sourceType: 'module',
      },
      name: `nicksp/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    }
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately
      name: 'nicksp/typescript/setup',
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        'erasable-syntax-only': pluginErasableSyntaxOnly,
      },
    },

    // Assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...(typeAware
      ? [makeParser(true, filesTypeAware, ignoresTypeAware)]
      : [makeParser(false, files)]),

    {
      files,
      name: 'nicksp/typescript/recommended',
      rules: {
        ...(typeAware ? recommendedTypeCheckedRules : recommendedRules),
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
            objectLiteralTypeAssertions: 'allow-as-parameter',
          },
        ],
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
        '@typescript-eslint/no-redeclare': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
        '@typescript-eslint/no-unnecessary-parameter-property-assignment':
          'error',
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

    ...(typeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'nicksp/typescript/type-aware-rules',
            rules: {
              ...typeAwareRules,
              ...overridesTypeAware,
            },
          },
        ]
      : []),

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

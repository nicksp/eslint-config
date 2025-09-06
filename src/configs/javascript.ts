import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import globals from 'globals'

import {
  configJs,
  pluginAntfu,
  pluginDeMorgan,
  pluginUnusedImports,
} from '../plugins'

import type { Config, OptionsIsInEditor, OptionsOverrides } from '../types'

export const restrictedSyntaxJs: AST_NODE_TYPES[] = [
  AST_NODE_TYPES.ForInStatement,
  AST_NODE_TYPES.LabeledStatement,
  AST_NODE_TYPES.TSExportAssignment,
]

export async function javascript(
  options: OptionsIsInEditor & OptionsOverrides = {},
): Promise<Config[]> {
  const { isInEditor = false, overrides = {} } = options

  return [
    {
      ...configJs.configs.recommended,
      name: 'nicksp/javascript/recommended',
    },
    {
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2026,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      name: 'nicksp/javascript/setup',
    },
    {
      name: 'nicksp/javascript/rules',
      plugins: {
        antfu: pluginAntfu,
        'de-morgan': pluginDeMorgan,
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        'accessor-pairs': [
          'error',
          { enforceForClassMembers: true, setWithoutGet: true },
        ],

        'antfu/no-top-level-await': 'error',

        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'default-case-last': 'error',
        'dot-notation': isInEditor ? 'warn' : 'error',
        eqeqeq: ['error', 'smart'],
        'new-cap': [
          'error',
          { capIsNew: false, newIsCap: true, properties: true },
        ],
        'no-alert': isInEditor ? 'warn' : 'error',
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-console': [
          isInEditor ? 'warn' : 'error',
          { allow: ['warn', 'error'] },
        ],
        'no-debugger': isInEditor ? 'warn' : 'error',
        'no-duplicate-imports': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-inner-declarations': 'error',
        'no-iterator': 'error',
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-restricted-globals': [
          'error',
          { message: 'Use `globalThis` instead.', name: 'global' },
          { message: 'Use `globalThis` instead.', name: 'self' },
        ],
        'no-restricted-properties': [
          'error',
          {
            message:
              'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
            property: '__proto__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineGetter__',
          },
          {
            message: 'Use `Object.defineProperty` instead.',
            property: '__defineSetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupGetter__',
          },
          {
            message: 'Use `Object.getOwnPropertyDescriptor` instead.',
            property: '__lookupSetter__',
          },
        ],
        'no-restricted-syntax': [
          'error',
          ...restrictedSyntaxJs,
          'TSEnumDeclaration[const=true]',
        ],
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unreachable-loop': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-unused-vars': [
          'error',
          {
            args: 'none',
            caughtErrors: 'none',
            ignoreRestSiblings: true,
            vars: 'all',
          },
        ],
        'no-use-before-define': [
          'error',
          { classes: false, functions: false, variables: true },
        ],
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'one-var': ['error', { initialized: 'never' }],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true,
          },
        ],
        'prefer-const': [
          isInEditor ? 'warn' : 'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true,
          },
        ],
        'prefer-exponentiation-operator': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'symbol-description': 'error',
        'unicode-bom': ['error', 'never'],

        'unused-imports/no-unused-imports': isInEditor ? 'warn' : 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            varsIgnorePattern: '^_',
          },
        ],

        'use-isnan': [
          'error',
          { enforceForIndexOf: true, enforceForSwitchCase: true },
        ],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'vars-on-top': 'error',
        yoda: ['error', 'never'],

        ...pluginDeMorgan.configs.recommended.rules,

        ...overrides,
      },
    },
  ]
}

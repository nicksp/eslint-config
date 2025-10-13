import globals from 'globals'

import { GLOB_ASTRO, GLOB_ASTRO_JS, GLOB_ASTRO_TS } from '../globs'
import { tseslint } from '../plugins'
import { interopDefault } from '../utils'

import type { Config, OptionsFiles, OptionsOverrides } from '../types'

export async function astro(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<Config[]> {
  const { files = [GLOB_ASTRO], overrides = {} } = options

  const [parserAstro, pluginAstro] = await Promise.all([
    interopDefault(import('astro-eslint-parser')),
    interopDefault(import('eslint-plugin-astro')),
  ])

  return [
    {
      name: 'nicksp/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
        },
        // The script of Astro components uses ESM
        sourceType: 'module',
      },
      name: 'nicksp/astro/rules',
      processor: 'astro/client-side-ts',
      rules: {
        // Astro uses top level await for e.g. data fetching
        // https://docs.astro.build/en/guides/data-fetching/#fetch-in-astro
        'antfu/no-top-level-await': 'off',

        // Recommended rules
        'astro/missing-client-only-directive-value': 'error',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/valid-compile': 'error',

        ...overrides,
      },
    },
    {
      files: [GLOB_ASTRO_JS],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
        sourceType: 'module',
      },
      // Define the configuration for `<script>` tag.
      // Script in `<script>` is assigned a virtual file name with the `.js` extension.
      name: 'nicksp/astro/script/javascript',
      rules: {
        // We don't need to format inside <script> as it will be formatted as a `.astro` file.
        'prettier/prettier': 'off',
      },
    },
    {
      files: [GLOB_ASTRO_TS],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
        parser: tseslint.parser,
        parserOptions: {
          project: null,
        },
        sourceType: 'module',
      },
      // Define the configuration for `<script>` tag when using `client-side-ts` processor.
      // Script in `<script>` is assigned a virtual file name with the `.ts` extension.
      name: 'nicksp/astro/script/typescript',
      rules: {
        // We don't need to format inside <script> as it will be formatted as a `.astro` file.
        'prettier/prettier': 'off',
      },
    },
    {
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: 'nicksp/astro/disables',
      rules: {
        // Stop linter from replacing `class` with `className`
        'react-dom/no-unknown-property': 'off',
      },
    },
  ]
}

import { isPackageExists } from 'local-pkg'

import {
  GLOB_ASTRO_TS,
  GLOB_MARKDOWN,
  GLOB_SRC,
  GLOB_TS,
  GLOB_TSX,
} from '../globs'
import { ensurePackages, interopDefault } from '../utils'

import type { Config, OptionsFiles, OptionsTypescript } from '../types'

// react refresh
const ReactRefreshAllowConstantExportPackages = ['vite']
const ReactRouterPackages = [
  '@react-router/node',
  '@react-router/react',
  '@react-router/serve',
  '@react-router/dev',
]
const NextJsPackages = ['next']

export async function react(
  options: OptionsTypescript & OptionsFiles = {},
): Promise<Config[]> {
  const {
    files = [GLOB_SRC],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
    overrides = {},
    typeAware,
  } = options

  await ensurePackages([
    '@eslint-react/eslint-plugin',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
  ])

  const [pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all(
    [
      interopDefault(import('@eslint-react/eslint-plugin')),
      interopDefault(import('eslint-plugin-react-hooks')),
      interopDefault(import('eslint-plugin-react-refresh')),
    ],
  )

  const typeAwareRules: Config['rules'] = {
    'react-x/no-leaked-conditional-rendering': 'warn',
  }

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
    i => isPackageExists(i),
  )
  const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i))
  const isUsingNext = NextJsPackages.some(i => isPackageExists(i))

  const plugins = (pluginReact.configs.all as any).plugins

  return [
    {
      name: 'nicksp/react/setup',
      plugins: {
        'react-dom': plugins['@eslint-react/dom'],
        'react-hooks': pluginReactHooks,
        'react-hooks-extra': plugins['@eslint-react/hooks-extra'],
        'react-naming-convention': plugins['@eslint-react/naming-convention'],
        'react-refresh': pluginReactRefresh,
        'react-web-api': plugins['@eslint-react/web-api'],
        'react-x': plugins['@eslint-react'],
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      name: 'nicksp/react/rules',
      rules: {
        // recommended rules from eslint-plugin-react-x https://eslint-react.xyz/docs/rules/overview#core-rules
        ...plugins['@eslint-react'].configs.recommended.rules,

        // recommended rules from eslint-plugin-react-dom https://eslint-react.xyz/docs/rules/overview#dom-rules
        ...plugins['@eslint-react/dom'].configs.recommended.rules,

        // recommended rules from eslint-plugin-react-hooks https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks/src/rules
        ...pluginReactHooks.configs.recommended.rules,

        // recommended rules from eslint-plugin-react-hooks-extra https://eslint-react.xyz/docs/rules/overview#hooks-extra-rules
        ...plugins['@eslint-react/hooks-extra'].configs.recommended.rules,

        // recommended rules from eslint-plugin-react-naming-convention https://eslint-react.xyz/docs/rules/overview#naming-convention-rules
        ...plugins['@eslint-react/naming-convention'].configs.recommended.rules,

        // recommended rules from eslint-plugin-react-web-api https://eslint-react.xyz/docs/rules/overview#web-api-rules
        ...plugins['@eslint-react/web-api'].configs.recommended.rules,

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        // ...pluginReactRefresh.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'error',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              // from https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
              ...(isUsingNext
                ? [
                    'experimental_ppr',
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'viewport',
                  ]
                : []),
              // from https://reactrouter.com/explanation/hot-module-replacement#supported-exports
              ...(isUsingReactRouter
                ? [
                    'action',
                    'headers',
                    'links',
                    'loader',
                    'meta',
                    'clientLoader',
                    'clientAction',
                    'handle',
                    'shouldRevalidate',
                  ]
                : []),
            ],
          },
        ],

        ...overrides,
      },
    },

    ...(typeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'nicksp/react/type-aware-rules',
            rules: {
              ...typeAwareRules,
            },
          },
        ]
      : []),
  ]
}

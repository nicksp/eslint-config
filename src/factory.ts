import {
  type Arrayable,
  type Awaitable,
  FlatConfigComposer,
} from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'

import {
  astro,
  comments,
  disables,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  nextjs,
  node,
  prettier,
  react,
  sortImports,
  sortPackageJson,
  sortTsconfig,
  test,
  typescript,
  unicorn,
  yaml,
} from './configs'
import { regexp } from './configs/regexp'
import { getOverrides, isInEditorEnv, resolveSubOptions } from './utils'

import type { Linter } from 'eslint'
import type { Config, ConfigNames, Options } from './types'

/**
 * Construct an array of ESLint flat config items.
 *
 * @param options - The options for generating the ESLint configurations.
 * @param userConfigs - The user configurations to be merged with the generated configurations.
 * @returns The merged ESLint configurations.
 */
export function defineConfig(
  options: Options & Omit<Config, 'files'> = {},
  ...userConfigs: Awaitable<
    Arrayable<Config> | FlatConfigComposer<any, any> | Linter.Config[]
  >[]
): FlatConfigComposer<Config, ConfigNames> {
  const {
    astro: enableAstro = false,
    jsx: enableJsx = true,
    nextjs: enableNextjs = false,
    prettier: enablePrettier = true,
    react: enableReact = false,
    regexp: enableRegexp = true,
    type: projectType = 'app',
    typescript: enableTypeScript = isPackageExists('typescript'),
    yaml: enableYaml = true,
  } = options

  const isInEditor = isInEditorEnv()
  if (isInEditor) {
    // eslint-disable-next-line no-console
    console.log(
      '[@nicksp/eslint-config] Detected running in editor, some rules are disabled.',
    )
  }

  const configs: Awaitable<Config[]>[] = []

  const prettierOptions =
    typeof enablePrettier === 'object' ? enablePrettier.options : {}

  const typescriptOptions = resolveSubOptions(options, 'typescript')

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    unicorn(),
    comments(),
    node(),
    jsdoc(),
    imports(),
    sortImports(),
  )

  if (enableJsx) {
    configs.push(jsx(enableJsx === true ? {} : enableJsx))
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        overrides: getOverrides(options, 'typescript'),
        type: projectType,
      }),
    )
  }

  if (enablePrettier) {
    configs.push(
      prettier({
        enableAstro: Boolean(enableAstro),
        options: prettierOptions,
      }),
    )
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (options.test ?? true) {
    configs.push(
      test({
        isInEditor,
        overrides: getOverrides(options, 'test'),
      }),
    )
  }

  if (enableReact) {
    configs.push(
      react({
        ...typescriptOptions,
        overrides: getOverrides(options, 'react'),
      }),
    )
  }

  if (enableNextjs) {
    configs.push(
      nextjs({
        overrides: getOverrides(options, 'nextjs'),
      }),
    )
  }

  if (enableAstro) {
    configs.push(
      astro({
        overrides: getOverrides(options, 'astro'),
      }),
    )
  }

  configs.push(jsonc(), sortPackageJson(), sortTsconfig())

  if (enableYaml) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
      }),
    )
  }

  configs.push(disables())

  if ('files' in options) {
    throw new Error(
      '[@nicksp/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    )
  }

  let composer = new FlatConfigComposer<Config, ConfigNames>()

  composer = composer.append(...configs, ...(userConfigs as any))

  if (isInEditor) {
    composer = composer.disableRulesFix(
      [
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const',
      ],
      {
        builtinRules: () =>
          import(['eslint', 'use-at-your-own-risk'].join('/')).then(
            r => r.builtinRules,
          ),
      },
    )
  }

  return composer
}

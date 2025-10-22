import type { Linter } from 'eslint'
import type { Options as PrettierOptions } from 'prettier'
import type { ConfigNames, RuleOptions } from './typegen'

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> &
  RuleOptions

export type { ConfigNames }

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type Config = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export type OptionsJSXA11y = {
  // Add future a11y-specific options here
} & OptionsOverrides

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * Can be a boolean or an object for custom options and overrides.
   * @default false
   */
  a11y?: boolean | OptionsJSXA11y
}

export type OptionsTypescript = OptionsTypeScriptWithTypes & OptionsOverrides

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/getting-started/typed-linting/
   * @default true
   */
  typeAware?: boolean

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: Config['rules']
}

export interface OptionsOverrides {
  overrides?: Config['rules']
}

export interface OptionsPrettierOptions {
  options?: PrettierOptions
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib'
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn'
}

export interface OptionsIsInEditor {
  isInEditor?: boolean
}

export interface OptionsEnableAstro {
  enableAstro?: boolean
}

export type Options = {
  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides

  /**
   * Enable Prettier support.
   *
   * By default it's controlled by our own config.
   *
   * @see https://prettier.io/docs/
   * @default true
   */
  prettier?: boolean | OptionsPrettierOptions

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides)

  /**
   * Enable Astro support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default false
   */
  astro?: boolean | OptionsOverrides

  /**
   * Enable React rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default false
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable Nextjs rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default false
   */
  nextjs?: boolean | OptionsOverrides
} & OptionsProjectType

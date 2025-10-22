/* eslint-disable node/no-process-env */
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { isPackageExists } from 'local-pkg'

import type { Linter } from 'eslint'
import type { Awaitable } from 'eslint-flat-config-utils'
import type { RuleOptions } from './typegen'
import type { Options, ResolvedOptions } from './types'

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))
const isCwdInScope = isPackageExists('@nicksp/eslint-config')

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}

export async function ensurePackages(
  packages: (string | undefined)[],
): Promise<void> {
  if (
    process.env.CI != null ||
    process.stdout.isTTY === false ||
    isCwdInScope === false
  ) {
    return
  }

  const nonExistingPackages = packages.filter(
    p => typeof p === 'string' && !isPackageInScope(p),
  ) as string[]
  if (nonExistingPackages.length === 0) {
    return
  }

  const p = await import('@clack/prompts')
  const result = await p.confirm({
    message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`,
  })
  if (result === true) {
    await import('@antfu/install-pkg').then(async i =>
      i.installPackage(nonExistingPackages, { dev: true }),
    )
  }
}

export async function interopDefault<T>(
  module: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await module

  return (resolved as any).default ?? resolved
}

export function isInEditorEnv(): boolean {
  if (process.env.CI != null) {
    return false
  }
  if (isInGitHooksOrLintStaged()) {
    return false
  }
  return (
    process.env.VSCODE_PID != null ||
    process.env.VSCODE_CWD != null ||
    process.env.JETBRAINS_IDE != null ||
    process.env.VIM != null ||
    process.env.NVIM != null
  )
}

export function isInGitHooksOrLintStaged(): boolean {
  return !!(
    process.env.GIT_PARAMS != null ||
    process.env.VSCODE_GIT_COMMAND != null ||
    process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}

export function resolveSubOptions<K extends keyof Options>(
  options: Options,
  key: K,
): ResolvedOptions<Options[K]> {
  return typeof options[key] === 'boolean'
    ? ({} as any)
    : (options[key] ?? ({} as any))
}

export function getOverrides(
  options: Options,
  key: keyof Options,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(typeof sub === 'object' && 'overrides' in sub ? sub.overrides : {}),
  }
}

import { pluginPerfectionist } from '../plugins'

import type { Config } from '../types'

/**
 * Sort package.json
 */
export function sortPackageJson(): Config[] {
  return [
    {
      files: ['**/package.json'],
      name: 'nicksp/sort/package-json',
      rules: {
        'jsonc/sort-array-values': [
          'error',
          {
            order: { type: 'asc' },
            pathPattern: '^files$',
          },
        ],
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'publisher',
              'name',
              'displayName',
              'description',
              'version',
              'type',
              'private',
              'packageManager',
              'author',
              'contributors',
              'license',
              'funding',
              'homepage',
              'repository',
              'bugs',
              'keywords',
              'categories',
              'sideEffects',
              'main',
              'imports',
              'exports',
              'module',
              'types',
              'unpkg',
              'jsdelivr',
              'typesVersions',
              'bin',
              'icon',
              'files',
              'engines',
              'activationEvents',
              'contributes',
              'directories',
              'publishConfig',
              'scripts',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'dependencies',
              'devDependencies',
              'pnpm',
              'overrides',
              'resolutions',
              'browserslist',
              'husky',
              'simple-git-hooks',
              'lint-staged',
              'eslintConfig',
              'prettier',
              'tsdown',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern:
              '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$',
          },
          {
            order: { type: 'asc' },
            pathPattern: String.raw`^workspaces\.catalog$`,
          },
          {
            order: { type: 'asc' },
            pathPattern: String.raw`^workspaces\.catalogs\.[^.]+$`,
          },
          {
            order: ['types', 'require', 'import', 'default'],
            pathPattern: '^exports.*$',
          },
          {
            order: [
              // client hooks only
              'pre-commit',
              'prepare-commit-msg',
              'commit-msg',
              'post-commit',
              'pre-rebase',
              'post-rewrite',
              'post-checkout',
              'post-merge',
              'pre-push',
              'pre-auto-gc',
            ],
            pathPattern: '^(?:gitHooks|husky|simple-git-hooks)$',
          },
        ],
      },
    },
  ]
}

/**
 * Sort tsconfig.json
 */
export function sortTsconfig(): Config[] {
  return [
    {
      files: ['**/[jt]sconfig.json', '**/[jt]sconfig.*.json'],
      name: 'nicksp/sort/tsconfig',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'extends',
              'compilerOptions',
              'references',
              'files',
              'include',
              'exclude',
            ],
            pathPattern: '^$',
          },
          {
            order: [
              /* Projects */
              'incremental',
              'composite',
              'tsBuildInfoFile',
              'disableSourceOfProjectReferenceRedirect',
              'disableSolutionSearching',
              'disableReferencedProjectLoad',
              /* Language and Environment */
              'target',
              'jsx',
              'jsxFactory',
              'jsxFragmentFactory',
              'jsxImportSource',
              'lib',
              'moduleDetection',
              'noLib',
              'reactNamespace',
              'useDefineForClassFields',
              'emitDecoratorMetadata',
              'experimentalDecorators',
              'libReplacement',
              /* Modules */
              'baseUrl',
              'rootDir',
              'rootDirs',
              'customConditions',
              'module',
              'moduleResolution',
              'moduleSuffixes',
              'noResolve',
              'paths',
              'resolveJsonModule',
              'resolvePackageJsonExports',
              'resolvePackageJsonImports',
              'typeRoots',
              'types',
              'allowArbitraryExtensions',
              'allowImportingTsExtensions',
              'allowUmdGlobalAccess',
              /* JavaScript Support */
              'allowJs',
              'checkJs',
              'maxNodeModuleJsDepth',
              /* Type Checking */
              'strict',
              'strictBindCallApply',
              'strictFunctionTypes',
              'strictNullChecks',
              'strictPropertyInitialization',
              'allowUnreachableCode',
              'allowUnusedLabels',
              'alwaysStrict',
              'exactOptionalPropertyTypes',
              'noFallthroughCasesInSwitch',
              'noImplicitAny',
              'noImplicitOverride',
              'noImplicitReturns',
              'noImplicitThis',
              'noPropertyAccessFromIndexSignature',
              'noUncheckedIndexedAccess',
              'noUnusedLocals',
              'noUnusedParameters',
              'useUnknownInCatchVariables',
              /* Emit */
              'declaration',
              'declarationDir',
              'declarationMap',
              'downlevelIteration',
              'emitBOM',
              'emitDeclarationOnly',
              'importHelpers',
              'importsNotUsedAsValues',
              'inlineSourceMap',
              'inlineSources',
              'mapRoot',
              'newLine',
              'noEmit',
              'noEmitHelpers',
              'noEmitOnError',
              'outDir',
              'outFile',
              'preserveConstEnums',
              'preserveValueImports',
              'removeComments',
              'sourceMap',
              'sourceRoot',
              'stripInternal',
              /* Interop Constraints */
              'allowSyntheticDefaultImports',
              'erasableSyntaxOnly',
              'esModuleInterop',
              'forceConsistentCasingInFileNames',
              'isolatedDeclarations',
              'isolatedModules',
              'preserveSymlinks',
              'verbatimModuleSyntax',
              /* Completeness */
              'skipDefaultLibCheck',
              'skipLibCheck',
            ],
            pathPattern: '^compilerOptions$',
          },
        ],
      },
    },
  ]
}

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function sortImports(): Config[] {
  return [
    {
      name: 'nicksp/sort/imports',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': ['error', { type: 'natural' }],
        'perfectionist/sort-imports': [
          'error',
          {
            customGroups: [
              {
                elementNamePattern: ['^react$', '^react-.+'],
                groupName: 'react',
                selector: 'type',
              },
              {
                elementNamePattern: ['^next$', '^next[/-].+'],
                groupName: 'next',
                selector: 'type',
              },
              {
                elementNamePattern: ['^react$', '^react-.+'],
                groupName: 'react',
              },
              {
                elementNamePattern: ['^next$', '^next[/-].+'],
                groupName: 'next',
              },
            ],
            groups: [
              'react',
              'next',
              { newlinesBetween: 1 },
              'builtin',
              'external',
              { newlinesBetween: 1 },
              'internal',
              ['parent', 'sibling', 'index'],
              { newlinesBetween: 1 },
              'type',
              { newlinesBetween: 1 },
              'side-effect',
              'side-effect-style',
              'style',
              'unknown',
            ],
            newlinesBetween: 'ignore',
            type: 'natural',
          },
        ],
        'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      },
    },
  ]
}

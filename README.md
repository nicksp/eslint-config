# @nicksp/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Node.js CI status][ci-src]][ci-href]
[![pkg.pr.new][cr-src]][cr-href]

Shared ESLint config I use on my personal projects. Based on [antfu's config](https://github.com/antfu/eslint-config).

## Difference

- Format with Prettier
- Only the tools I use are supported
- More stricter rules
- Simpler setup

## Highlights

- Play well with TypeScript and Prettier
- Target tools I use personally on the majority of the projects: React, Next, Astro and Vitest
- Sort imports, `package.json`, `tsconfig.json`
- [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files) for better organization and composition
- Respects `.gitignore` by default
- Reasonable defaults, best practices, only one-line of config
- Requires ESLint v9.5.0+

## Setup

```shell
pnpm add -D eslint@latest @nicksp/eslint-config
```

Create `eslint.config.mjs` in your project root:

```js
import { defineConfig } from '@nicksp/eslint-config'

export default defineConfig()
```

Add scripts for `package.json`:

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "format": "prettier --write \"**/*.{js,cjs,mjs,jsx,ts,tsx,astro,css,json,md}\""
  }
}
```

Configure VS Code for auto-fix on save in `.vscode/settings.json`:

```jsonc
{
  // Use the Prettier formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,

  // Autosave files on focus change
  "files.autoSave": "onFocusChange",
  // Don’t autosave files with syntax errors
  "files.autoSaveWhenNoErrors": true,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in your IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true },
    { "rule": "*-spaces", "severity": "off", "fixable": true },
    { "rule": "*-order", "severity": "off", "fixable": true },
    { "rule": "*-dangle", "severity": "off", "fixable": true },
    { "rule": "*-newline", "severity": "off", "fixable": true },
    { "rule": "*quotes", "severity": "off", "fixable": true },
    { "rule": "*semi", "severity": "off", "fixable": true }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html",
    "markdown",
    "json",
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

## Usage

```js
// eslint.config.js
import { defineConfig } from '@nicksp/eslint-config'

export default defineConfig(
  {
    // Type of the project. 'lib' for libraries, the default is 'app'
    type: 'lib',

    // Formatting with Prettier is enabled by default, you can disable it
    prettier: false,

    // TypeScript is autodetected, you can also explicitly enable it
    typescript: true,

    // Disable jsx support
    jsx: false,

    // You can configure each integration individually as well
    yaml: {
      overrides: {
        // ...
      },
    },

    ignores: [
      '**/fixtures',
      // ...globs
    ]
  },

  // You can have multiple config overrides
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
)

// Advanced config
// See more at https://github.com/antfu/eslint-flat-config-utils
.prepend(
  // some configs before the main config
).removeRules('foo/bar')
```

### Optional configs

These are optional configs for specific use cases.

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually.

```js
// eslint.config.js
import { defineConfig } from '@nicksp/eslint-config'

export default defineConfig({
  // Enable React support
  react: true,

  // Enable Next.js support
  nextjs: true,

  // Enable Astro support
  astro: true,
})
```

## Other Projects You Might Like

- [nicksp/dotfiles](https://github.com/nicksp/dotfiles/) - My dotfiles and VS Code settings
- [nicksp/prettier-config](https://github.com/nicksp/prettier-config) - My Prettier config
- [nicksp/renovate-config](https://github.com/nicksp/renovate-config) - My Renovate config
- [nicksp/workflows](https://github.com/nicksp/workflows) - Reusable GitHub Actions workflows

## License

[MIT](LICENSE) License &copy; 2025 [Nick Plekhanov](https://plekhanov.me)

<!-- Badges -->
[npm-version-src]: <https://img.shields.io/npm/v/@nicksp/eslint-config.svg>
[npm-version-href]: <https://npmjs.com/package/@nicksp/eslint-config>
[npm-downloads-src]: <https://img.shields.io/npm/dm/@nicksp/eslint-config>
[npm-downloads-href]: <https://www.npmcharts.com/compare/@nicksp/eslint-config?interval=30>
[ci-src]: <https://github.com/nicksp/eslint-config/workflows/CI/badge.svg>
[ci-href]: <https://github.com/nicksp/eslint-config/actions/workflows/ci.yml>
[cr-src]: <https://pkg.pr.new/badge/nicksp/eslint-config>
[cr-href]: <https://pkg.pr.new/~/nicksp/eslint-config>

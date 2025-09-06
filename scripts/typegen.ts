import { writeFile } from 'node:fs/promises'
// eslint-disable-next-line node/no-unsupported-features/node-builtins
import { styleText } from 'node:util'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import {
  astro,
  comments,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  nextjs,
  node,
  prettier,
  react,
  regexp,
  sortImports,
  sortPackageJson,
  sortTsconfig,
  test,
  typescript,
  unicorn,
  yaml,
} from '../src'

const configs = (
  await Promise.all([
    {
      name: 'builtin-rules',
      plugins: {
        '': {
          rules: Object.fromEntries(builtinRules),
        },
      },
    },
    astro(),
    comments(),
    prettier(),
    imports(),
    javascript(),
    jsx({ a11y: true }),
    jsdoc(),
    jsonc(),
    node(),
    sortImports(),
    nextjs(),
    react(),
    sortPackageJson(),
    sortTsconfig(),
    test(),
    regexp(),
    typescript(),
    unicorn(),
    yaml(),
  ])
).flat()

const configNames = configs.map(i => i.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await writeFile('src/typegen.d.ts', dts)

console.log(styleText('green', 'Type definitions generated!'))

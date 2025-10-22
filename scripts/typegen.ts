import { writeFile } from 'node:fs/promises'
import { styleText } from 'node:util'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import { builtinRules } from 'eslint/use-at-your-own-risk'

import {
  astro,
  comments,
  type Config,
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

async function presetAll(): Promise<Config[]> {
  return [
    ...(await astro()),
    ...comments(),
    ...(await prettier()),
    ...imports(),
    ...javascript(),
    ...(await jsx({ a11y: true })),
    ...jsdoc(),
    ...jsonc(),
    ...node(),
    ...sortImports(),
    ...(await nextjs()),
    ...(await react()),
    ...sortPackageJson(),
    ...sortTsconfig(),
    ...test(),
    ...regexp(),
    ...typescript(),
    ...unicorn(),
    ...yaml(),
  ]
}

const configs = [
  ...(await presetAll()),
  {
    name: 'builtin-rules',
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules),
      },
    },
  },
]

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
})

const configNames = configs.map(i => i.name).filter(Boolean) as string[]
dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`

await writeFile('src/typegen.d.ts', dts)

console.log(styleText('green', 'Type definitions generated!'))

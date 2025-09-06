import { pluginAntfu, pluginImportLite } from '../plugins'

import type { Config } from '../types'

export async function imports(): Promise<Config[]> {
  return [
    {
      name: 'nicksp/imports/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
      },
    },
  ]
}

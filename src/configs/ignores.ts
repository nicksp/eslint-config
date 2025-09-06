import { GLOB_EXCLUDE } from '../globs'
import { pluginIgnore } from '../plugins'

import type { Config } from '../types'

export async function ignores(userIgnores: string[] = []): Promise<Config[]> {
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...userIgnores],
      name: 'nicksp/ignores/global',
    },
    {
      ...pluginIgnore({ strict: false }),
      name: 'nicksp/ignores/gitignore',
    },
  ]
}

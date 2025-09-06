import { expect, it } from 'vitest'

import { defineConfig } from '../src'

it('default options - all enabled configs', async () => {
  const configs = defineConfig({})
  const configArray = await configs.toConfigs()

  expect(configArray).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'nicksp/javascript/rules' }),
      expect.objectContaining({ name: 'nicksp/ignores/global' }),
      expect.objectContaining({ name: 'nicksp/imports/rules' }),
      expect.objectContaining({ name: 'nicksp/unicorn/rules' }),
      expect.objectContaining({ name: 'nicksp/comments/rules' }),
      expect.objectContaining({ name: 'nicksp/node/rules' }),
      expect.objectContaining({ name: 'nicksp/jsdoc/rules' }),
      expect.objectContaining({ name: 'nicksp/jsx/setup' }),
      expect.objectContaining({ name: 'nicksp/prettier/rules' }),
      expect.objectContaining({ name: 'nicksp/regexp/rules' }),
      expect.objectContaining({ name: 'nicksp/sort/imports' }),
      expect.objectContaining({ name: 'nicksp/test/rules' }),
      expect.objectContaining({ name: 'nicksp/yaml/rules' }),
    ]),
  )
})

it('disabling jsx', async () => {
  const configs = defineConfig({ jsx: false })
  const configArray = await configs.toConfigs()
  const hasJsx = configArray.some(c => c.name?.includes('/jsx/'))

  expect(hasJsx).toBe(false)
})

it('disabling prettier', async () => {
  const configs = defineConfig({ prettier: false })
  const configArray = await configs.toConfigs()
  const hasPrettier = configArray.some(c => c.name?.includes('/prettier/'))

  expect(hasPrettier).toBe(false)
})

it('disabling regexp', async () => {
  const configs = defineConfig({ regexp: false })
  const configArray = await configs.toConfigs()
  const hasRegexp = configArray.some(c => c.name?.includes('/regexp/'))

  expect(hasRegexp).toBe(false)
})

it('disabling test', async () => {
  const configs = defineConfig({ test: false })
  const configArray = await configs.toConfigs()
  const hasTest = configArray.some(c => c.name?.includes('/test/'))

  expect(hasTest).toBe(false)
})

it('disabling yaml', async () => {
  const configs = defineConfig({ yaml: false })
  const configArray = await configs.toConfigs()
  const hasYaml = configArray.some(c => c.name?.includes('/yaml/'))

  expect(hasYaml).toBe(false)
})

it('enabling react', async () => {
  const configs = defineConfig({ react: true })
  const configArray = await configs.toConfigs()

  expect(configArray).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'nicksp/react/rules' }),
    ]),
  )
})

it('enabling astro', async () => {
  const configs = defineConfig({ astro: true })
  const configArray = await configs.toConfigs()

  expect(configArray).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'nicksp/astro/setup' }),
    ]),
  )
})

it('enabling nextjs', async () => {
  const configs = defineConfig({ nextjs: true })
  const configArray = await configs.toConfigs()

  expect(configArray).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'nicksp/nextjs/rules' }),
    ]),
  )
})

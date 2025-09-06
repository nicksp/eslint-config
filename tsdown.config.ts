import process from 'node:process'
import { defineConfig } from 'tsdown'

export default defineConfig({
  shims: true,
  minify: process.env.NODE_ENV === 'production',
})

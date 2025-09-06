import { defineConfig } from './src'

export default defineConfig({
  type: 'lib',
}).append({
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
})

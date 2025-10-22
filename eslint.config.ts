import { defineConfig } from './src'

export default defineConfig({
  type: 'lib',
  typescript: {
    overridesTypeAware: {
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
}).append({
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
})

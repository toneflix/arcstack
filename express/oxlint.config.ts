import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'warn',
  },
  rules: {
    'typescript/no-require-imports': 'error',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'eslint/no-unused-vars': 'error',
    'typescript/await-thenable': 'error',
    'import/no-commonjs': 'error',
    'no-unreachable': 'error',
    'no-unneeded-ternary': 'error',
    'typescript/require-await': 'error',
    'typescript/no-explicit-any': 'error',
    'no-duplicate-imports': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_|_',
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^I[A-Z]|^_',
      },
    ],
  },
  ignorePatterns: ['dist/**', 'node_modules/**', 'src/**/*.spec.ts', 'coverage/**'],
  plugins: ['eslint', 'typescript', 'import'],
})

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    passWithNoTests: true,
    pool: 'threads',
    name: 'generic',
    environment: 'node',
    root: './',
    include: ['tests/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*', '**/.h3ravel/**'],
    }
  }
})

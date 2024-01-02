import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
// import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      ...(command === 'build'
        ? [
            babel({
              babelHelpers: 'bundled',
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                      browsers: '> 0.25%, not dead',
                    },
                  },
                ],
              ],
              exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/],
            }),
          ]
        : []),
    ],
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
    optimizeDeps: {
      include: ['styleguidist'],
    },
    build: {
      minify: false,
      reportCompressedSize: true,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'scripture-tsv',
        fileName: format => (format === 'es' ? 'main.es.js' : 'main.cs.js'),
        formats: ['cjs', 'es'],
      },
      rollupOptions: {
        external: [
          'bible-reference-range',
          'react',
          'react-dom',
          '@emotion/react',
          '@emotion/styled',
          '@mui/icons-material',
          '@mui/material',
          '@mui/styles',
        ],
        plugins: [
          typescript({
            sourceMap: false,
            declaration: true,
            outDir: 'dist',
          }),
        ],
      },
    },
  }
})

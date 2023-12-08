import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    optimizeDeps: {
      include: ['styleguidist'],
    },
    build: {
      minify: false,
      reportCompressedSize: true,
      lib: {
        entry: 'src/index.ts',
        name: 'scripture-tsv',
        fileName: 'main',
        formats: ['es', 'cjs'],
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
          typescriptPaths({
            preserveExtensions: true,
          }),
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

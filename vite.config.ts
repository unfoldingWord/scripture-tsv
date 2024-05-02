import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => `scripture-tsv.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        ...Object.keys(pkg.devDependencies),
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
    },
  },
})

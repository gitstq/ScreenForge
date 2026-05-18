import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const mainConfig = defineConfig({
  build: {
    outDir: 'dist/main',
    lib: {
      entry: resolve(__dirname, 'src/main/main.ts'),
      formats: ['cjs'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      external: ['electron', 'electron-store', 'fluent-ffmpeg', 'uuid'],
    },
  },
})

const preloadConfig = defineConfig({
  build: {
    outDir: 'dist/preload',
    lib: {
      entry: resolve(__dirname, 'src/preload/preload.ts'),
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external: ['electron', 'electron-context-menu'],
    },
  },
})

const rendererConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
})

export default mergeConfig(
  rendererConfig,
  mainConfig,
  preloadConfig
)

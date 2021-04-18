import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'docs'
  },
  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  }
})

import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      external: ['vue', 'vue-router', 'three'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          three: 'THREE',
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  }
})

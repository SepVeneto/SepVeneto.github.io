import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import globalExternal from './plugins/globalExternal';

// const cdnMap: Map<RegExp, string> = new Map([
//   [/from.*(["|']vue["|'])/g, 'https://unpkg.com/vue@3.0.11/dist/vue.runtime.esm-browser.prod.js'],
//   [/from.*(["|']three["|'])/g, 'https://cdn.skypack.dev/three@0.130.1'],
//   [/from.*(["|']vue-router["|'])/g, 'https://unpkg.com/vue-router@4.0.6/dist/vue-router.esm-browser.js'],
// ]);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(command, mode)
  const config = {
    plugins: [vue(), vueJsx()],
    build: {
      outDir: 'docs',
      rollupOptions: {
        // external: ['vue', 'three'],
        // plugins: [{
        //   name: 'replace-import',
        //   renderChunk(code) {
        //     for (const [reg, cdn] of cdnMap.entries()) {
        //       // code.includes('ignoreDuplicateOf') && console.log(code)
        //       code = code.replace(reg, `from '${cdn}'`);
        //     }
        //     return { code, map: null };
        //   }
        // }]
      }
    },
  }
  if (command === 'serve') {
    return {
      ...config,
      resolve: {
        alias: {
          '@': path.resolve('src'),
        }
      }
    }
  } else {
    return {
      ...config,
      resolve: {
        alias: {
          '@': path.resolve('src'),
          'vue': 'https://unpkg.com/vue@3.0.11/dist/vue.runtime.esm-browser.prod.js',
          // 'vue-router': 'https://unpkg.com/vue-router@4.0.6/dist/vue-router.esm-browser.js',
          'three': 'https://cdn.skypack.dev/three@0.130.1',
        }
      }
    }
  }
})

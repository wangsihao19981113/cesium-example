import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import {fileURLToPath} from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src',import.meta.url))
    }
  }
})

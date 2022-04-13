const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockServe } from 'vite-plugin-mock'
import vueSvgLoader from 'vite-svg-loader'

export default defineConfig(config => {
  process.env.NODE_ENV = config.mode
  return {
    // root: './public',
    base: '/vite-path/',
    mode: 'development',
    plugins: [vue(), vueJsx(), vueSvgLoader(), viteMockServe({ supportTs: false })],
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.join(__dirname, '/src')
      }
    }
  }
})


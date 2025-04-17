import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const currentDir = dirname(fileURLToPath(import.meta.url))
console.log(currentDir)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  modules: ['@ant-design-vue/nuxt'],
  extends: ['@xizs/nuxt-base'],
  css: [join(currentDir, './app/assets/css/main.css')],
  vite:{
    plugins: [tailwindcss()],
  }
})
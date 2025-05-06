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
  modules: ['@ant-design-vue/nuxt', '@nuxtjs/i18n'],
  extends: ['@xizs/nuxt-base'],
  css: [join(currentDir, './app/assets/css/main.css')],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' }
    ]
  }
})
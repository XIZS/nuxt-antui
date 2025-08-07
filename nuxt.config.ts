import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const currentDir = dirname(fileURLToPath(import.meta.url))

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
    defaultLocale: 'zh_CN',
    strategy: 'no_prefix',
      compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: [
      { code: 'zh_CN', name: '🇨🇳 简体中文', file: 'zh_CN.json' },
      { code: 'zh_TW', name: '🇨🇳 繁体中文', file: 'zh_TW.json' },
      { code: 'en_US', name: '🇲🇾 English', file: 'en_US.json' },
      { code: 'vi_VN', name: '🇻🇳 Việt Nam', file: 'vi_VN.json' },
      { code: 'id_ID', name: '🇮🇩 Indonesia', file: 'id_ID.json' },
      { code: 'ms_MY', name: '🇲🇾 Melayu', file: 'ms_MY.json' },
    ]
  }
})
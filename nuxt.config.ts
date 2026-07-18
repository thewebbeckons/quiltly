// https://nuxt.com/docs/api/configuration/nuxt-config
const isBuildCommand = process.argv.includes('build')
const nitroPreset = process.env.NITRO_PRESET || (isBuildCommand ? 'cloudflare-module' : undefined)
const hubHosting = nitroPreset || 'node'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/a11y',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxthub/core',
    '@onmax/nuxt-better-auth',
    'nuxt-email-renderer'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false
  },

  runtimeConfig: {
    emailFrom: 'noreply@quiltly.app',
    cfAccountId: '',
    cfEmailApiToken: ''
  },

  routeRules: {
    '/login': { auth: 'guest' },
    '/reset-password': { auth: false },
    '/dashboard': { auth: 'user' },
    '/settings': { auth: 'user' },
    '/supplies': { auth: 'user' },
    '/supplies/**': { auth: 'user' },
    '/projects': { auth: 'user' },
    '/projects/**': { auth: 'user' },
    '/bookmarks': { auth: 'user' },
    '/bookmarks/**': { auth: 'user' }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    ...(nitroPreset ? { preset: nitroPreset } : {})
  },

  hub: {
    hosting: hubHosting,
    db: 'sqlite',
    blob: true
  },

  auth: {
    serverConfig: 'server/auth.config',
    clientConfig: 'app/auth.config',
    redirects: {
      login: '/login',
      guest: '/dashboard',
      logout: '/login'
    },
    schema: {
      casing: 'snake_case'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

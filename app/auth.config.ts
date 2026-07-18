import { defineClientAuth } from '@onmax/nuxt-better-auth/config'

export default defineClientAuth(({ siteUrl }) => ({
  // Auth is served by this Nuxt app, so browser requests must always stay
  // on the origin that loaded the page. The configured site URL is retained
  // as the non-browser fallback for build and server contexts.
  baseURL: import.meta.client ? window.location.origin : siteUrl
}))

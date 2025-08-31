// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image'],

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      // firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
  },
  typescript: {
    strict: true
  },
  nitro: {
    preset: 'static'
  },
  app: {
    head: {
      title: 'App Maison – Gestion de stock',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  css: ['@/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
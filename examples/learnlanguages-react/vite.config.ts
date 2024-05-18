import process from 'node:process'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { ManifestOptions, VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'
import legacy from '@vitejs/plugin-legacy'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.png'],
  manifest: {
    name: 'Offline timer',
    short_name: 'Offline timer',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'alarm-192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/alarm-512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'alarm-512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = { __DATE__: new Date().toISOString() }
const claims = process.env.CLAIMS === 'true'
const reload = process.env.RELOAD_SW === 'true'
const selfDestroying = process.env.SW_DESTROY === 'true'

if (process.env.SW === 'true') {
  pwaOptions.srcDir = 'src'
  pwaOptions.filename = claims ? 'claims-sw.ts' : 'prompt-sw.ts'
  pwaOptions.strategies = 'injectManifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).name = 'PWA Inject Manifest'
  ;(pwaOptions.manifest as Partial<ManifestOptions>).short_name = 'PWA Inject'
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true,
  }
}

if (claims)
  pwaOptions.registerType = 'autoUpdate'

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = 'true'
}

if (selfDestroying)
  pwaOptions.selfDestroying = selfDestroying

export default defineConfig({
  // base: process.env.BASE_URL || 'https://github.com/',
  define: {
    __BUILD__: `"${new Date().toISOString()}"`,
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    react(),
    legacy({
      /**
       * 1. try changing these values
       * 2. run `pnpm build`, see the output files in dist directory
       * 3. run `pnpm preview`, see the actual loaded files in different versions of browsers
       */
      targets: ['ie >= 11'],
      renderLegacyChunks: true,
      modernPolyfills: true,
    }),
    VitePWA(pwaOptions),
    replace(replaceOptions),
  ],
})

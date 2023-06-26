import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@sorare': fileURLToPath(new URL('./packages', import.meta.url)),
      '@core': fileURLToPath(new URL('./packages/core/src', import.meta.url)),
      '@football': fileURLToPath(new URL('./packages/football/src', import.meta.url)),
      '@marketplace': fileURLToPath(new URL('./packages/marketplace/src', import.meta.url)),
      '@shared-pages': fileURLToPath(new URL('./packages/shared-pages/src', import.meta.url)),
      '@us-sports': fileURLToPath(new URL('./packages/us-sports/src', import.meta.url)),
      '@wallet-shared': fileURLToPath(new URL('./packages/wallet-shared/src', import.meta.url)),
      '__generated__': fileURLToPath(new URL('./packages/core/src/__generated__', import.meta.url)),
    }
  }
})

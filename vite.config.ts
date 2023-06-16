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
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly clear postcss plugins to prevent loading external config
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})

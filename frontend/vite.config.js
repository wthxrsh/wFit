import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly clear postcss plugins to prevent loading external config
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    // This is handled by the proxy in package.json
  },
})

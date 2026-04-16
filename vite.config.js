import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/socialos/',
  plugins: [react()],
  server: {
    // Proxy API calls to the serverless function during local dev
    proxy: {
      '/socialos/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socialos/, ''),
      },
    },
  },
})

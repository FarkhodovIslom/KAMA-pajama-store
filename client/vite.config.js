
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'https://loraleet.alwaysdata.net',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://loraleet.alwaysdata.net',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,

    proxy: {
      '/api': {
        target: 'https://torida-v2.vercel.app',
        changeOrigin: true,
      },
      '/health': {
        target: 'https://torida-v2.vercel.app',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:7260',
        changeOrigin: true,
        secure: false,
      },
      '/hubs': {
        target: 'https://localhost:7260',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})

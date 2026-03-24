import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom'],
          router:  ['react-router-dom'],
          query:   ['@tanstack/react-query'],
          charts:  ['recharts'],
          forms:   ['react-hook-form', 'zod', '@hookform/resolvers'],
          utils:   ['date-fns', 'axios'],
          icons:   ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

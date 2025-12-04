import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Customers.Api/wwwroot/admin',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/customers': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})

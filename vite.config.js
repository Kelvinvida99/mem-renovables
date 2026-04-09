import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para evitar CORS con la API del OC durante desarrollo
      '/api/oc': {
        target: 'https://apps.oc.org.do',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oc/, ''),
        secure: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PUBLIC_INTERFACE
// Vite configuration for Tizen TV dev server.
// Ensures the dev server binds to 0.0.0.0 on port 3000 for container readiness.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for Tizen TV dev server in containerized environments.
 * - Binds to 0.0.0.0 on port 3000
 * - Uses polling-based watcher with sane intervals to avoid CPU spikes/OOM in Docker
 * - Disables watching of env files to avoid restarts from external env management
 * - Configures HMR to work through container networking
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    // Vite v5 HMR auto-detects; explicit port/host not required in container
    // File watcher tuning to prevent excessive restarts and memory usage
    watch: {
      usePolling: true,
      interval: 500,
      awaitWriteFinish: {
        stabilityThreshold: 800,
        pollInterval: 200,
      },
      // Ignore env and lock/tmp files to prevent auto-restarts from external tooling
      ignored: ['**/.env', '**/.env.*', '**/*.lock', '**/*.tmp', '**/post_process_status.lock'],
    },
  },
  // Prevent env changes from causing hot reload storms
  envDir: '.',
  // Do not include .env in optimizeDeps scanning to avoid triggering rebuilds
  optimizeDeps: {
    include: [],
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
})

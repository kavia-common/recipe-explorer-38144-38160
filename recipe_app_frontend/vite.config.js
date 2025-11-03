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
    // Keep HMR lightweight in CI by disabling overlay, which spawns heavy error frames
    hmr: {
      overlay: false,
    },
    // File watcher tuning to prevent excessive restarts and memory usage
    watch: {
      usePolling: true,
      interval: 700,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 250,
      },
      // Only watch our working sources and entry HTML to reduce churn
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/*.lock',
        '**/*.tmp',
        '**/post_process_status.lock',
        '**/node_modules/**',
        '**/dist/**',
      ],
    },
  },
  // Prevent env changes from causing hot reload storms
  envDir: '.',
  // Keep dependency optimization minimal for memory-constrained environments
  optimizeDeps: {
    include: [],
    exclude: [], // nothing to prebundle aggressively
    force: false, // avoid re-optimizing on startup unless needed
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
})

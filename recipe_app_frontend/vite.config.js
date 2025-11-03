import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for Tizen TV dev server in containerized environments.
 * - Binds to 0.0.0.0 on port 3000 (strict)
 * - Allows external preview host for reverse-proxy previews
 * - Uses polling-based watcher to reduce CPU/memory in Docker/CI
 * - Disables heavy HMR overlays and avoids reload storms
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Allow the preview ingress host
    allowedHosts: ['vscode-internal-22842-qa.qa01.cloud.kavia.ai'],
    // Keep HMR lightweight and stable
    hmr: {
      overlay: false,
      // Prefer websocket transport and avoid full reloads on small fs noise
      server: undefined,
    },
    // File watcher tuning to prevent excessive restarts and memory usage
    watch: {
      usePolling: true,
      interval: 800,
      awaitWriteFinish: {
        stabilityThreshold: 1200,
        pollInterval: 300,
      },
      ignored: [
        '**/.env',
        '**/.env.*',
        '**/*.lock',
        '**/*.tmp',
        '**/post_process_status.lock',
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/.cache/**',
      ],
    },
    // Avoid automatic restarts on config change within CI (stability over agility)
    // Note: Vite restarts when vite.config.* changes; minimize such writes in CI.
  },
  // Keep dependency optimization minimal for memory-constrained environments
  optimizeDeps: {
    include: [],
    exclude: [],
    force: false,
    esbuildOptions: {
      target: 'es2020',
    },
  },
  // Prevent env changes from causing hot reload storms
  envDir: '.',
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['vscode-internal-22842-qa.qa01.cloud.kavia.ai'],
  },
})

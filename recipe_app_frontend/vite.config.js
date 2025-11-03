import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * PUBLIC_INTERFACE
 * Vite configuration for Tizen TV dev server in containerized environments.
 * - Binds to 0.0.0.0 on port 3000 (strict)
 * - Limits FS watching scope to reduce memory and restarts
 * - Uses polling-based watcher tuned for Docker/CI
 * - Disables overlay to avoid noisy reload storms
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['vscode-internal-22842-qa.qa01.cloud.kavia.ai'],
    hmr: {
      overlay: false,
      server: undefined,
    },
    // File watcher tuning to prevent excessive restarts and memory usage
    watch: {
      usePolling: true,
      interval: 1200, // slower polling to reduce CPU/memory
      awaitWriteFinish: {
        stabilityThreshold: 1500,
        pollInterval: 400,
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
        '**/.vite/**',
      ],
    },
    // Restrict filesystem scanning to the frontend container directory
    fs: {
      strict: true,
      // allow only this container root
      allow: ['.'],
      // disallow following symlinks outside project to avoid large scans
      followSymlinks: false,
    },
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
  envDir: '.',
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['vscode-internal-22842-qa.qa01.cloud.kavia.ai'],
  },
})

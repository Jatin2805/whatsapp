import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Completely disable Sentry
    __SENTRY_DEBUG__: false,
    __SENTRY_TRACING__: false,
    __SENTRY_REPLAY__: false,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: ['@sentry/react', '@sentry/browser', '@sentry/replay', '@sentry/tracing']
    }
  }
});
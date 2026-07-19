import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Performance optimizations - use esbuild (default, faster than terser)
    minify: 'esbuild',
    cssMinify: true,
    // Optimize chunk size for faster loading
    chunkSizeWarningLimit: 500,
    // Reduce bundle size
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Preload optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
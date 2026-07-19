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
    // Performance optimizations
    minify: 'terser',
    cssMinify: true,
    // Optimize chunk size for faster loading
    chunkSizeWarningLimit: 500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
          }
          // Inline Vercel analytics in main chunk to load after app
          if (id.includes('@vercel')) {
            return 'vendor';
          }
        },
      },
    },
    // Reduce bundle size
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Preload optimizations - disable for faster first paint
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
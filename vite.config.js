import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path when served in development or production.
  base: '/',

  build: {
    // Specify the output directory (relative to project root).
    outDir: 'dist',
    
    // Generate source maps for easier debugging in production (can be disabled if privacy is an issue)
    sourcemap: false,

    // Minify output using esbuild (Vite's default and fastest)
    minify: 'esbuild',

    // Ensure older browsers can parse the code if necessary
    target: 'es2020',

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Advanced code splitting: group vendor libraries into a separate chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('locomotive-scroll')) {
              return 'vendor-scroll';
            }
            return 'vendor-core'; // all other dependencies
          }
        },
        // Cache-busting mechanisms for static assets
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
      }
    }
  },

  // Adjust preview settings if needed locally
  preview: {
    port: 4173,
    host: true
  }
});

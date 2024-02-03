import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'InstagramContentScript': './src/contentScripts/InstagramContentScript.tsx',
        'instagramServiceWorker': './src/serviceWorkers/instagramServiceWorker.ts',
        'index': 'index.html',
      },
      output: {
        entryFileNames: ({ name }) => `assets/${name}.js`,
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  }
})

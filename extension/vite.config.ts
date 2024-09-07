import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'instagramContentScript': './src/contentScripts/instagramContentScript.ts',
        'instagramServiceWorker': './src/serviceWorkers/instagramServiceWorker.ts',
        'redditServiceWorker': './src/serviceWorkers/redditServiceWorker.ts',
        'twitterContentScript': './src/contentScripts/twitterContentScript.ts',
        'twitterServiceWorker': './src/serviceWorkers/twitterServiceWorker.ts',
        'apiRoutes': './src/serviceWorkers/apiRoutes.ts',
        'background': './src/serviceWorkers/background.ts',
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

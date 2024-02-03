import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'instagramContentScript': './src/contentScripts/instagramContentScript.ts',
        'RedditContentScript': './src/contentScripts/RedditContentScript.tsx',
        'YoutubeContentScript': './src/contentScripts/YoutubeContentScript.tsx',
        'youtubeServiceWorker': './src/serviceWorkers/youtubeServiceWorker.ts',
        'instagramServiceWorker': './src/serviceWorkers/instagramServiceWorker.ts',
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

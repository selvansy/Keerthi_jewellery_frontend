import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
 base: '/',
  server: {
    historyApiFallback: true, // Add this for Vite dev server
  },
  server: {
    host: true
  }

})




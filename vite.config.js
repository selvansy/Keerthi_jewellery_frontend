import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
 base: '/',
  server: {
    historyApiFallback: true,
    host: '0.0.0.0',
    hmr: {
      protocol: "ws",
      host: '192.168.0.6',
      port: 5173,
      overlay: false,
    },
  },
})
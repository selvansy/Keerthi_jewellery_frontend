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
    host: '0.0.0.0', // <- allows access from network devices
    // allowedHosts: [
    //   'cdcfaf917ac8.ngrok-free.app' // no protocol, just the hostname
    // ],
    hmr: {
      protocol: "ws",
      host: '192.168.0.7', // Replace with your real local IP
      port: 1420,
      overlay: false,
    },
  },
})
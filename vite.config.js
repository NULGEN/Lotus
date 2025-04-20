import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://workintech-fe-ecommerce.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 300000, // Increased to 5 minutes
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
          // Add keep-alive settings
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Keep-Alive', 'timeout=300'); // 5 minutes timeout
          });
        }
      }
    }
  }
})
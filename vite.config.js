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
        timeout: 60000, // 1 minute
        secure: process.env.NODE_ENV === 'production',
        ws: true,
        configure: (proxy, _options) => {
          // Single proxyReq handler for all request modifications
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Log outgoing request
            console.log('Outgoing Request:', {
              method: req.method,
              url: req.url,
              timestamp: new Date().toISOString()
            });

            // Set consistent headers
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Keep-Alive', 'timeout=60');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
          });

          // Handle proxy errors
          proxy.on('error', (err, req, res) => {
            const errorResponse = {
              timestamp: new Date().toISOString(),
              path: req.url,
              error: err.message,
              code: err.code
            };

            console.error('Proxy Error:', errorResponse);

            // Don't attempt to send response if headers already sent
            if (res.headersSent) {
              return;
            }

            // Handle specific error types
            if (err.code === 'ECONNRESET' || err.message.includes('socket hang up')) {
              res.writeHead(502, {
                'Content-Type': 'application/json',
                'Retry-After': '5'
              });
              res.end(JSON.stringify({
                error: 'Connection Reset',
                message: 'The connection was interrupted. Please try again.',
                details: errorResponse
              }));
              return;
            }

            if (err.code === 'ETIMEDOUT') {
              res.writeHead(504, {
                'Content-Type': 'application/json',
                'Retry-After': '10'
              });
              res.end(JSON.stringify({
                error: 'Gateway Timeout',
                message: 'The request timed out. Please try again.',
                details: errorResponse
              }));
              return;
            }

            // Default error response
            res.writeHead(500, {
              'Content-Type': 'application/json',
              'Retry-After': '15'
            });
            res.end(JSON.stringify({
              error: 'Proxy Error',
              message: 'An unexpected error occurred. Please try again later.',
              details: errorResponse
            }));
          });

          // Handle proxy response
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Log incoming response
            console.log('Incoming Response:', {
              method: req.method,
              url: req.url,
              status: proxyRes.statusCode,
              timestamp: new Date().toISOString()
            });

            // Set response headers
            proxyRes.headers['connection'] = 'keep-alive';
            proxyRes.headers['keep-alive'] = 'timeout=60';
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['pragma'] = 'no-cache';
          });
        }
      }
    }
  }
})
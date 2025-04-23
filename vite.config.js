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
        timeout: 600000, // 10 minutes
        proxyTimeout: 600000,
        keepAliveTimeout: 600000,
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

            // Set consistent headers with longer timeouts
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Keep-Alive', 'timeout=600');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
          });

          let retryCount = new Map();

          // Handle proxy errors with retry logic
          proxy.on('error', (err, req, res) => {
            const currentRetries = retryCount.get(req.url) || 0;
            const maxRetries = 5; // Increased from 3 to 5
            
            const errorResponse = {
              timestamp: new Date().toISOString(),
              path: req.url,
              error: err.message,
              code: err.code,
              retryCount: currentRetries
            };

            console.error('Proxy Error:', errorResponse);

            // Don't attempt to send response if headers already sent
            if (res.headersSent) {
              return;
            }

            // Implement retry logic for specific errors with exponential backoff
            if ((err.code === 'ECONNRESET' || err.message.includes('socket hang up')) && currentRetries < maxRetries) {
              const retryDelay = Math.min(1000 * Math.pow(2, currentRetries), 60000); // More gradual backoff
              retryCount.set(req.url, currentRetries + 1);
              
              setTimeout(() => {
                console.log(`Retrying request to ${req.url} (attempt ${currentRetries + 1})`);
                req.emit('retry');
              }, retryDelay);
              
              return;
            }

            // Clear retry count after max retries or other errors
            retryCount.delete(req.url);

            if (err.code === 'ECONNRESET' || err.message.includes('socket hang up')) {
              res.writeHead(502, {
                'Content-Type': 'application/json',
                'Retry-After': '60'
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
                'Retry-After': '120'
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
              'Retry-After': '120'
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

            // Set response headers with longer timeouts
            proxyRes.headers['connection'] = 'keep-alive';
            proxyRes.headers['keep-alive'] = 'timeout=600';
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['pragma'] = 'no-cache';
          });
        }
      }
    }
  }
})
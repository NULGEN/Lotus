import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  // Retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }
});

// Add token to requests if it exists in localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = token;
}

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.retryCount += 1;

    const delayMs = config.retryDelay(config.retryCount);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    return api(config);
  }
);

export default api;
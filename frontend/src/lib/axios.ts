import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60s timeout for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = (typeof window !== 'undefined' ? (sessionStorage.getItem('token') || localStorage.getItem('token')) : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-retry up to 2 times for idempotent GET requests if server is waking up
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.method || config.method.toLowerCase() !== 'get') {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    const isNetworkOr5xx = !error.response || (error.response.status >= 500 && error.response.status <= 504);

    if (isNetworkOr5xx && config.__retryCount < 2) {
      config.__retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 2000 * config.__retryCount));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;

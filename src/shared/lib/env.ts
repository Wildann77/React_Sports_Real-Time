const isProd = import.meta.env.PROD;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

if (isProd) {
  if (!apiBaseUrl) {
    throw new Error('Missing required environment variable: VITE_API_BASE_URL');
  }
  if (!wsUrl) {
    throw new Error('Missing required environment variable: VITE_WS_URL');
  }
}

export const env = {
  API_BASE_URL: apiBaseUrl || 'http://localhost:8000/api/v1',
  WS_URL: wsUrl || 'ws://localhost:8000/ws',
};


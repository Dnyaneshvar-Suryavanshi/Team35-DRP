// Environment configuration
const config = {
  apiBaseUrl: '/api',
  environment: import.meta.env.MODE || 'development',
};

export default config;

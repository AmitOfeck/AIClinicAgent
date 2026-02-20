/**
 * Environment configuration for the client application.
 * Values are loaded from Vite environment variables.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;

export type Env = typeof env;

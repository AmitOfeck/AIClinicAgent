/**
 * API endpoint paths.
 * These are relative paths that will be prefixed with the API base URL.
 */
export const API_ENDPOINTS = {
  chat: '/api/chat',
  health: '/api/health',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

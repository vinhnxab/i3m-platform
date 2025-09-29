export const API_CONFIG = {
  // Base URL for API Gateway
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api',

  // Individual service URLs (for direct access if needed)
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://i3m.local:3002',
  USER_SERVICE_URL: import.meta.env.VITE_USER_SERVICE_URL || 'http://i3m.local:3002',
  CONTENT_SERVICE_URL: import.meta.env.VITE_CONTENT_SERVICE_URL || 'http://i3m.local:3003',

  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 seconds
  REFRESH_TOKEN_TIMEOUT: 30000, // 30 seconds

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true' || import.meta.env.DEV,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User management endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    ANALYTICS: '/dashboard/analytics',
  },
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'Access forbidden. You do not have permission.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  WEAK_PASSWORD: 'Password is too weak.',
  INVALID_TOKEN: 'Invalid or expired token.',
} as const;

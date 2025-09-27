// Layout constants
export const LAYOUT_TYPES = {
  AUTH: 'auth',
  DASHBOARD: 'dashboard', 
  PUBLIC: 'public',
  NONE: 'none'
} as const;

// Pattern opacity constants
export const PATTERN_OPACITY = {
  GRID: 0.2,
  CIRCUIT: 0.6,
  HEXAGON: 0.5,
  NETWORK: 0.4,
  TECH: 0.35,
  BLUR: 0.1
} as const;

// Route patterns for layout detection
export const ROUTE_PATTERNS = {
  AUTH: ['/login', '/register', '/forgot-password'],
  DASHBOARD: ['/', '/dashboard', '/overview', '/support', '/templates', '/services', '/customers', '/scrum', '/aiml', '/workflow', '/security', '/performance', '/backup', '/api', '/settings'],
  PUBLIC: ['/public']
} as const;

// Color constants
export const COLORS = {
  BLUE: {
    PRIMARY: 'rgba(59, 130, 246, 0.6)',
    SECONDARY: 'rgba(59, 130, 246, 0.7)',
    TERTIARY: 'rgba(59, 130, 246, 0.8)',
    LIGHT: 'rgba(59, 130, 246, 0.1)'
  },
  CYAN: {
    PRIMARY: 'rgba(6, 182, 212, 0.7)',
    SECONDARY: 'rgba(6, 182, 212, 0.6)',
    TERTIARY: 'rgba(6, 182, 212, 0.8)',
    LIGHT: 'rgba(6, 182, 212, 0.9)'
  },
  PURPLE: {
    PRIMARY: 'rgba(147, 51, 234, 0.6)',
    SECONDARY: 'rgba(147, 51, 234, 0.7)',
    TERTIARY: 'rgba(147, 51, 234, 0.5)'
  }
} as const;

// Constants for Food Security Dashboard

// Performance budgets
export const PERFORMANCE = {
  LOAD_TIME_3G: 3000, // ms
  LOAD_TIME_WIFI: 1000, // ms
  BUNDLE_SIZE_INITIAL: 500, // KB
  BUNDLE_SIZE_TOTAL: 2048 // KB
};

// Accessibility standards
export const ACCESSIBILITY = {
  WCAG_LEVEL: 'AA',
  MIN_SCORE: 90 // percent
};

// Data refresh intervals
export const CACHE_TIME = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000 // 10 minutes
};

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4'
};

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280
};

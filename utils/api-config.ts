// API configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use localhost. In production, use relative path (Netlify handles routing)
const API_BASE_URL = isDevelopment 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  : '';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/api/${API_VERSION}/${endpoint}`;
};

// Endpoints
export const ENDPOINTS = {
  LOCATIONS: {
    MAPPINGS: 'locations/mappings',
    COUNTRIES: 'locations/countries',
    CITIES: 'locations/cities',
    MAPPING: 'locations/mapping',
  }
} as const; 
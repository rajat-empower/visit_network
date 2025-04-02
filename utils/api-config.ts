// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  return `${baseUrl}/${endpoint}`;
};

// Endpoints
export const ENDPOINTS = {
  LOCATIONS: {
    COUNTRIES: 'locations/countries',
    REGIONS: 'locations/regions',
    CITIES: 'locations/cities',
    MAPPING: 'locations/mapping',
    MAPPINGS: 'locations/mappings'
  },
  TOURS: {
    VERIFY: 'tours/verify',
    PREVIEW: 'tours/preview',
    IMPORT: 'tours/import',
    RESET: 'tours/reset',
    IMPORTED_DATA: '/api/tours/imported-data',
  },
  MEDIA: {
    UPLOAD: 'tours/upload'
  }
} as const; 
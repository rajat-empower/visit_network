// API configuration
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'
  : 'https://visitnetworkdev.netlify.app/.netlify/functions/api';

export const API_VERSION = 'v1';

export const ENDPOINTS = {
  LOCATIONS: {
    COUNTRIES: '/locations/countries',
    CITIES: '/locations/cities',
    MAPPINGS: '/locations/mappings',
    MAPPING: '/locations/mapping',
    CITY_DETAILS: (cityId: string) => `/locations/cities/${cityId}`,
    REGENERATE_IMAGE: (cityId: string) => `/locations/cities/${cityId}/regenerate-image`
  },
  TOURS: {
    VERIFY: 'tours/verify',
    PREVIEW: 'tours/preview',
    IMPORT: 'tours/import',
    RESET: 'tours/reset',
    IMPORTED_DATA: 'tours/imported-data',
  },
  MEDIA: {
    UPLOAD: 'tours/upload'
  }
} as const;

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${API_VERSION}/${cleanEndpoint}`;
}; 
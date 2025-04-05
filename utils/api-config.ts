// API configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  : process.env.NEXT_PUBLIC_SITE_URL || '';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const getApiUrl = (endpoint: string): string => {
  // Remove any leading slashes from endpoint and version
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const cleanVersion = API_VERSION.replace(/^\/+/, '');
  
  // Ensure we have proper URL construction
  return `${API_BASE_URL}/api/${cleanVersion}/${cleanEndpoint}`;
};

// Endpoints
export const ENDPOINTS = {
  LOCATIONS: {
    COUNTRIES: 'locations/countries',
    REGIONS: 'locations/regions',
    CITIES: 'locations/cities',
    MAPPINGS: 'locations/mappings',
    MAPPING: 'locations/mapping',
    CITY_DETAILS: (cityId: string) => `locations/cities/${cityId}`,
    REGENERATE_IMAGE: (cityId: string) => `locations/cities/${cityId}/regenerate-image`,
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
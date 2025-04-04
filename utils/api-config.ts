// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return `${baseUrl}/${endpoint}`;
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
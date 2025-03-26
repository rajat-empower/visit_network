/**
 * API utility functions for making requests to the server-side API
 * This replaces direct Supabase calls in the frontend
 */

// Base URL for API requests
const API_BASE_URL = '/api';

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Tours API
 */
export const toursAPI = {
  // Get all tours with optional filters
  getTours: (params?: { city?: string; category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.city) queryParams.append('city', params.city);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI(`/tours${queryString}`);
  },
  
  // Get tour types
  getTourTypes: () => fetchAPI('/tour-types'),
  
  // Get tour details by name
  getTourByName: (name: string) => fetchAPI(`/tours/${encodeURIComponent(name)}`),
};

/**
 * Hotels API
 */
export const hotelsAPI = {
  // Get hotel details by city and name
  getHotelByName: (city: string, name: string) => 
    fetchAPI(`/hotels/${encodeURIComponent(city)}/${encodeURIComponent(name)}`),
};

/**
 * Articles API
 */
export const articlesAPI = {
  // Get all articles with optional filters
  getArticles: (params?: { category?: string; limit?: number; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.featured) queryParams.append('featured', params.featured.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI(`/articles${queryString}`);
  },
  
  // Get article details by slug
  getArticleBySlug: (slug: string) => fetchAPI(`/articles/${encodeURIComponent(slug)}`),
};

/**
 * Cities API
 */
export const citiesAPI = {
  // Get all cities with optional filters
  getCities: (params?: { featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append('featured', params.featured.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI(`/cities${queryString}`);
  },
  
  // Get city details by name
  getCityByName: (name: string) => fetchAPI(`/cities/${encodeURIComponent(name)}`),
};

/**
 * Places to Stay API
 */
export const placesAPI = {
  // Get all places to stay with optional filters
  getPlaces: (params?: { city?: string; type?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.city) queryParams.append('city', params.city);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI(`/places-to-stay${queryString}`);
  },
  
  // Get place details by city and name
  getPlaceByName: (city: string, name: string) => 
    fetchAPI(`/places-to-stay/${encodeURIComponent(city)}/${encodeURIComponent(name)}`),
};

/**
 * Contacts API
 */
export const contactsAPI = {
  // Get all contacts
  getContacts: () => fetchAPI('/contacts'),
};





// Export all APIs
export default {
  tours: toursAPI,
  hotels: hotelsAPI,
  articles: articlesAPI,
  cities: citiesAPI,
  places: placesAPI,
  contacts: contactsAPI,
}; 
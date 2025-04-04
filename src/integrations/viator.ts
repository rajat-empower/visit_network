import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { LocationsController } from '../controllers/locations.controller'; // Adjust the path as per your project structure
import { supabase } from '../config/supabase';  // Assuming supabase connection is configured here
import { 
  ViatorDestination, 
  ViatorPaginatedResponse, 
  ViatorResponse,
  ViatorTour 
} from '../types/viator';
import { Tour } from '../types/tour';
import { logger } from '../utils/logger';

config();

const VIATOR_API_BASE_URL = 'https://api.viator.com/partner';
const TAXONOMY_ENDPOINT = '/v1/taxonomy';
const PRODUCTS_ENDPOINT = '/products/search';
const VIATOR_API_KEY = process.env.VIATOR_API_KEY;
const PAGE_SIZE = 20;

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

interface DestinationSearchParams {
  destIds?: string[];
  type?: 'COUNTRY' | 'CITY' | 'REGION';
  parentDestId?: string;
  page?: number;
  limit?: number;
}

interface TourSearchParams {
  limit?: number;
  currency?: string;
  sortOrder?: 'RECOMMENDED' | 'PRICE_LOW_TO_HIGH' | 'PRICE_HIGH_TO_LOW' | 'RATING';
}

interface SearchToursParams {
  destinationId: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  limit?: number;
  page?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface GetCitiesOptions {
  limit?: number;
}

export class ViatorAPI {
  private static instance: ViatorAPI;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private cachedDestinations: Map<string, ViatorDestination[]> = new Map();

  constructor() {
    if (!VIATOR_API_KEY) {
      throw new Error('VIATOR_API_KEY environment variable is not set');
    }
    this.apiKey = VIATOR_API_KEY;
    this.baseUrl = VIATOR_API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'exp-api-key': this.apiKey
    };
  }

  public static getInstance(): ViatorAPI {
    if (!ViatorAPI.instance) {
      ViatorAPI.instance = new ViatorAPI();
    }
    return ViatorAPI.instance;
  }

  // private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
  //   try {
  //     const response = await axios({
  //       method,
  //       url: `${this.baseUrl}${endpoint}`,
  //       headers: this.headers,
  //       ...(method === 'GET' ? { params: data } : { data })
  //     });

  //     return response.data;
  //   } catch (error) {
  //     logger.error(`Viator API request failed for ${endpoint}:`, error);
  //     throw error;
  //   }
  // }


  private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;

      //console.log(`\n==== API Request ====\n`);
      //console.log(`Method: ${method}`);
      //console.log(`URL: ${fullUrl}`);
      
      if (endpoint === '/products/search' || method !== 'GET') {
        console.log(`Request Payload:`, JSON.stringify(data, null, 2));
      } else {
        console.log(`Query Params:`, JSON.stringify(data, null, 2));
      }

      console.log(`\n====================\n`);

      const response = await axios({
        method,
        url: fullUrl,
        headers: {
          ...this.headers,
        },
        timeout: 100000, // Set timeout to avoid infinite waiting
        ...(endpoint === '/products/search' || method !== 'GET' ? { data: data ?? {} } : { params: data })
      });
      
      //console.log(`\n==== API Response ====\n`, response.data);
        return response.data;
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      logger.error(`Viator API request failed for ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  
  
  

  private paginateResults<T>(items: T[], page: number = 1, limit: number = PAGE_SIZE): PaginatedResponse<T> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: paginatedItems,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore: endIndex < totalCount
    };
  }

  public async getDestinations(params?: DestinationSearchParams): Promise<PaginatedResponse<ViatorDestination>> {
    const cacheKey = params?.type || 'all';
    let destinations = this.cachedDestinations.get(cacheKey);

    if (!destinations) {
      const queryParams = new URLSearchParams();
      
      if (params?.destIds) {
        queryParams.append('destIds', params.destIds.join(','));
      }
      if (params?.type) {
        queryParams.append('type', params.type);
      }
      if (params?.parentDestId) {
        queryParams.append('parentDestId', params.parentDestId);
      }

      const endpoint = `${TAXONOMY_ENDPOINT}/destinations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<ViatorResponse<ViatorDestination[]>>(endpoint);
      destinations = response.data || [];
      this.cachedDestinations.set(cacheKey, destinations);
    }

    return this.paginateResults(
      destinations,
      params?.page || 1,
      params?.limit || PAGE_SIZE
    );
  }

  private async getAllDestinations(): Promise<ViatorDestination[]> {
    const cacheKey = 'all_destinations';
    let destinations = this.cachedDestinations.get(cacheKey);

    if (!destinations) {
      const response = await this.request<ViatorResponse<ViatorDestination[]>>(`${TAXONOMY_ENDPOINT}/destinations`);
      destinations = response.data || [];
      if (!destinations || !Array.isArray(destinations)) {
        console.error('Invalid destinations response:', response);
        return [];
      }
      this.cachedDestinations.set(cacheKey, destinations);
    }

    return destinations;
  }

  public async getCountries(): Promise<ViatorPaginatedResponse<ViatorDestination>> {
    try {
    const destinations = await this.getAllDestinations();
      
      if (!destinations || !Array.isArray(destinations)) {
        console.error('Invalid destinations data:', destinations);
        return {
          items: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
      }
    
    // Filter only COUNTRY type destinations and sort by name
    const countries = destinations
        .filter(dest => dest && dest.destinationType === 'COUNTRY')
      .sort((a, b) => a.destinationName.localeCompare(b.destinationName));

    return {
      items: countries,
      totalCount: countries.length,
      currentPage: 1,
      totalPages: 1,
      hasMore: false
    };
    } catch (error) {
      console.error('Error in getCountries:', error);
      throw error;
    }
  }

  public async getCitiesByCountries(countryIds: string[]): Promise<ViatorPaginatedResponse<ViatorDestination>> {
    try {
        // Step 1: Fetch all destinations without any filtering
      const response = await this.request<ViatorResponse<ViatorDestination[]>>(`${TAXONOMY_ENDPOINT}/destinations`);
        const destinations = response.data || [];

      if (!destinations || !Array.isArray(destinations)) {
        console.error('Invalid destinations response:', response);
        return {
          items: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
      }

        // Step 2: Create a map of country IDs to country names first
        const countryMap = destinations
        .filter(dest => dest && dest.destinationType === 'COUNTRY')
          .reduce((map, country) => {
            map.set(country.destinationId, country.destinationName);
            return map;
          }, new Map<string, string>());

        // Step 3: Convert countryIds array to a Set of numbers for faster lookup
        const countryIdSet = new Set(countryIds.map(id => Number(id)));

        // Step 4: Filter only cities whose parentId exists in countryIdSet
        const allCities = destinations.filter(({ destinationType, parentId }) => {
          const isCity = destinationType?.toUpperCase() === "CITY";
          const isValidParent = parentId && countryIdSet.has(Number(parentId));
          return isCity && isValidParent;
        });

        // Step 5: Add country names and sort cities
        const citiesWithCountries = allCities
          .map(city => ({
            ...city,
            countryName: city.parentId ? countryMap.get(city.parentId) : undefined
          }))
          .sort((a, b) => a.destinationName.localeCompare(b.destinationName));

        return {
          items: citiesWithCountries,
          totalCount: citiesWithCountries.length,
          currentPage: 1,
          totalPages: 1,
          hasMore: false
        };
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  public async getCountriesByIds(countryIds: string[]): Promise<PaginatedResponse<ViatorDestination>> {
    const destinations = await this.getAllDestinations();
    
    // Filter countries by IDs
    const countries = destinations
      .filter(dest => 
        dest.destinationType === 'COUNTRY' && 
        countryIds.includes(dest.destinationId)
      )
      .sort((a, b) => a.destinationName.localeCompare(b.destinationName));

    return {
      items: countries,
      totalCount: countries.length,
      currentPage: 1,
      totalPages: 1,
      hasMore: false
    };
  }

  public async getTours(limit: number = 1): Promise<ViatorPaginatedResponse<ViatorTour>> {
    try {
      const response = await this.request<ViatorResponse<ViatorTour[]>>('/v1/tours', 'GET', {
        limit,
        currency: 'USD'
      });

      const tours = response.data || [];
      
      return {
        items: tours,
        totalCount: tours.length,
        currentPage: 1,
        totalPages: 1,
        hasMore: false
      };
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }


  
public async getToursByCity(params: SearchToursParams): Promise<Tour[]> {
  try {
    const apiUrl = PRODUCTS_ENDPOINT;

    const requestBody = {
      filtering: {
        destination: params.destinationId,
      },
      currency: params.currency || 'USD',
      pagination: {
        start: ((params.page || 1) - 1) * (params.limit || PAGE_SIZE) + 1,
        count: params.limit || PAGE_SIZE
      }
    };

    // Fetch tours from Viator API
    const response = await this.request<any>(apiUrl, 'POST', requestBody);

    // Ensure response.products exists and is an array
    if (!response || !response.products || !Array.isArray(response.products)) {
      logger.warn(`No tours found for destination ${params.destinationId}`);
      return [];
    }

    // Get totalCount from the response metadata
    const totalCount = response.totalCount || 0;

    // Step 3: Map over the products (tours) and add city name and country name from cityMap
    return response.products.map((product: any) => {
    
      return {
        id: product.productCode || product.id,
        viator_id: product.productCode,
        title: product.title,
        description: product.description || '',
        price: product.pricing?.summary?.fromPrice || 0,
        currency: product.pricing?.currency || 'USD',
        duration: product.duration?.variableDurationFromMinutes 
          ? `${product.duration.variableDurationFromMinutes}-${product.duration.variableDurationToMinutes} minutes`
          : '',
        cityId: params.destinationId,
        cityName: product?.cityName || '',  // Add city name
        countryName: product?.countryName || '',  // Add country name
        images: product.images?.map((img: any) => {
          if (img.variants) {
            // Get the highest resolution image
            const sortedVariants = [...img.variants].sort((a, b) => (b.width * b.height) - (a.width * a.height));
            return sortedVariants[0]?.url;
          }
          return null;
        }).filter(Boolean) || [],
        destinationId: params.destinationId,
        bookingType: product.confirmationType || '',
        cancellationPolicy: product.flags?.includes('FREE_CANCELLATION') ? 'FREE_CANCELLATION' : '',
        highlights: [],  // Add any relevant information as needed
        inclusions: [],
        exclusions: [],
        additionalInfo: [],
        startingTime: '',
        languages: [],
        categories: [],
        rating: product.reviews?.combinedAverageRating || null,
        reviewCount: product.reviews?.totalReviews || 0,
        bookingLink: product.productUrl || '',
        isFeatured: false,
        status: 'ACTIVE',
        totalCount: totalCount,
        response_data: product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
  } catch (error) {
    logger.error(`Failed to get tours for destination ${params.destinationId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data || error.message);
    }
    throw error;
  }
}


public async getTourDetails(tourId: string): Promise<Tour> {
    try {
      const tour = await this.request<ViatorTour>(`/v1/products/${tourId}`);

      return {
        id: tour.id,
        viator_id: tour.id,
        title: tour.title,
        description: tour.description,
        productCode: String(tour.productCode),
        countryName: tour.location.country || '',
        price: tour.price.amount,
        currency: tour.price.currency,
        duration: tour.duration.text,
        cityId: tour.location.id,
        cityName: tour.location.name,
        destinationId: tour.location.id,
        images: tour.images.map(img => img.url),
        bookingType: tour.bookingInfo.type,
        cancellationPolicy: tour.bookingInfo.cancellationPolicy,
        highlights: tour.highlights || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        additionalInfo: tour.additionalInfo || [],
        startingTime: tour.startingTime,
        languages: tour.languages || [],
        categories: tour.categories.map(cat => cat.name),
        rating: tour.rating?.overall || null,
        reviewCount: tour.rating?.reviewCount || 0,
        bookingLink: tour.bookingLink || '',
        isFeatured: false,
        totalCount: tour.totalCount?.toString() || '0',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error(`Failed to get tour details for ${tourId}:`, error);
      throw error;
    }
  }

  public clearCache(): void {
    this.cachedDestinations.clear();
  }
}

// Create and export a singleton instance
export const viatorAPI = new ViatorAPI();
export default viatorAPI;
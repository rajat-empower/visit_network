"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viatorAPI = exports.ViatorAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const logger_1 = require("../utils/logger");
(0, dotenv_1.config)();
const VIATOR_API_BASE_URL = 'https://api.viator.com/partner';
const TAXONOMY_ENDPOINT = '/v1/taxonomy';
const PRODUCTS_ENDPOINT = '/products/search';
const VIATOR_API_KEY = process.env.VIATOR_API_KEY;
const PAGE_SIZE = 20;
class ViatorAPI {
    constructor() {
        this.cachedDestinations = new Map();
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
    static getInstance() {
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
    request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, method = 'GET', data) {
            var _a;
            try {
                const fullUrl = `${this.baseUrl}${endpoint}`;
                //console.log(`\n==== API Request ====\n`);
                //console.log(`Method: ${method}`);
                //console.log(`URL: ${fullUrl}`);
                if (endpoint === '/products/search' || method !== 'GET') {
                    console.log(`Request Payload:`, JSON.stringify(data, null, 2));
                }
                else {
                    console.log(`Query Params:`, JSON.stringify(data, null, 2));
                }
                console.log(`\n====================\n`);
                const response = yield (0, axios_1.default)(Object.assign({ method, url: fullUrl, headers: Object.assign({}, this.headers), timeout: 100000 }, (endpoint === '/products/search' || method !== 'GET' ? { data: data !== null && data !== void 0 ? data : {} } : { params: data })));
                //console.log(`\n==== API Response ====\n`, response.data);
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error('Axios error response:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                }
                else {
                    console.error('Unexpected error:', error);
                }
                logger_1.logger.error(`Viator API request failed for ${method} ${endpoint}:`, error);
                throw error;
            }
        });
    }
    paginateResults(items, page = 1, limit = PAGE_SIZE) {
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
    getDestinations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = (params === null || params === void 0 ? void 0 : params.type) || 'all';
            let destinations = this.cachedDestinations.get(cacheKey);
            if (!destinations) {
                const queryParams = new URLSearchParams();
                if (params === null || params === void 0 ? void 0 : params.destIds) {
                    queryParams.append('destIds', params.destIds.join(','));
                }
                if (params === null || params === void 0 ? void 0 : params.type) {
                    queryParams.append('type', params.type);
                }
                if (params === null || params === void 0 ? void 0 : params.parentDestId) {
                    queryParams.append('parentDestId', params.parentDestId);
                }
                const endpoint = `${TAXONOMY_ENDPOINT}/destinations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
                const response = yield this.request(endpoint);
                destinations = response.data || [];
                this.cachedDestinations.set(cacheKey, destinations);
            }
            return this.paginateResults(destinations, (params === null || params === void 0 ? void 0 : params.page) || 1, (params === null || params === void 0 ? void 0 : params.limit) || PAGE_SIZE);
        });
    }
    getAllDestinations() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = 'all_destinations';
            let destinations = this.cachedDestinations.get(cacheKey);
            if (!destinations) {
                const response = yield this.request(`${TAXONOMY_ENDPOINT}/destinations`);
                destinations = response.data || [];
                if (!destinations || !Array.isArray(destinations)) {
                    console.error('Invalid destinations response:', response);
                    return [];
                }
                this.cachedDestinations.set(cacheKey, destinations);
            }
            return destinations;
        });
    }
    getCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const destinations = yield this.getAllDestinations();
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
            }
            catch (error) {
                console.error('Error in getCountries:', error);
                throw error;
            }
        });
    }
    getCitiesByCountries(countryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch all destinations without any filtering
                const response = yield this.request(`${TAXONOMY_ENDPOINT}/destinations`);
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
                }, new Map());
                // Step 3: Convert countryIds array to a Set of numbers for faster lookup
                const countryIdSet = new Set(countryIds.map(id => Number(id)));
                // Step 4: Filter only cities whose parentId exists in countryIdSet
                const allCities = destinations.filter(({ destinationType, parentId }) => {
                    const isCity = (destinationType === null || destinationType === void 0 ? void 0 : destinationType.toUpperCase()) === "CITY";
                    const isValidParent = parentId && countryIdSet.has(Number(parentId));
                    return isCity && isValidParent;
                });
                // Step 5: Add country names and sort cities
                const citiesWithCountries = allCities
                    .map(city => (Object.assign(Object.assign({}, city), { countryName: city.parentId ? countryMap.get(city.parentId) : undefined })))
                    .sort((a, b) => a.destinationName.localeCompare(b.destinationName));
                return {
                    items: citiesWithCountries,
                    totalCount: citiesWithCountries.length,
                    currentPage: 1,
                    totalPages: 1,
                    hasMore: false
                };
            }
            catch (error) {
                console.error('Error fetching cities:', error);
                throw error;
            }
        });
    }
    getCountriesByIds(countryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinations = yield this.getAllDestinations();
            // Filter countries by IDs
            const countries = destinations
                .filter(dest => dest.destinationType === 'COUNTRY' &&
                countryIds.includes(dest.destinationId))
                .sort((a, b) => a.destinationName.localeCompare(b.destinationName));
            return {
                items: countries,
                totalCount: countries.length,
                currentPage: 1,
                totalPages: 1,
                hasMore: false
            };
        });
    }
    getTours() {
        return __awaiter(this, arguments, void 0, function* (limit = 1) {
            try {
                const response = yield this.request('/v1/tours', 'GET', {
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
            }
            catch (error) {
                console.error('Error fetching tours:', error);
                throw error;
            }
        });
    }
    getToursByCity(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                const response = yield this.request(apiUrl, 'POST', requestBody);
                // Ensure response.products exists and is an array
                if (!response || !response.products || !Array.isArray(response.products)) {
                    logger_1.logger.warn(`No tours found for destination ${params.destinationId}`);
                    return [];
                }
                // Get totalCount from the response metadata
                const totalCount = response.totalCount || 0;
                // Step 3: Map over the products (tours) and add city name and country name from cityMap
                return response.products.map((product) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return {
                        id: product.productCode || product.id,
                        viator_id: product.productCode,
                        title: product.title,
                        description: product.description || '',
                        price: ((_b = (_a = product.pricing) === null || _a === void 0 ? void 0 : _a.summary) === null || _b === void 0 ? void 0 : _b.fromPrice) || 0,
                        currency: ((_c = product.pricing) === null || _c === void 0 ? void 0 : _c.currency) || 'USD',
                        duration: ((_d = product.duration) === null || _d === void 0 ? void 0 : _d.variableDurationFromMinutes)
                            ? `${product.duration.variableDurationFromMinutes}-${product.duration.variableDurationToMinutes} minutes`
                            : '',
                        cityId: params.destinationId,
                        cityName: (product === null || product === void 0 ? void 0 : product.cityName) || '', // Add city name
                        countryName: (product === null || product === void 0 ? void 0 : product.countryName) || '', // Add country name
                        images: ((_e = product.images) === null || _e === void 0 ? void 0 : _e.map((img) => {
                            var _a;
                            if (img.variants) {
                                // Get the highest resolution image
                                const sortedVariants = [...img.variants].sort((a, b) => (b.width * b.height) - (a.width * a.height));
                                return (_a = sortedVariants[0]) === null || _a === void 0 ? void 0 : _a.url;
                            }
                            return null;
                        }).filter(Boolean)) || [],
                        destinationId: params.destinationId,
                        bookingType: product.confirmationType || '',
                        cancellationPolicy: ((_f = product.flags) === null || _f === void 0 ? void 0 : _f.includes('FREE_CANCELLATION')) ? 'FREE_CANCELLATION' : '',
                        highlights: [], // Add any relevant information as needed
                        inclusions: [],
                        exclusions: [],
                        additionalInfo: [],
                        startingTime: '',
                        languages: [],
                        categories: [],
                        rating: ((_g = product.reviews) === null || _g === void 0 ? void 0 : _g.combinedAverageRating) || null,
                        reviewCount: ((_h = product.reviews) === null || _h === void 0 ? void 0 : _h.totalReviews) || 0,
                        bookingLink: product.productUrl || '',
                        isFeatured: false,
                        status: 'ACTIVE',
                        totalCount: totalCount,
                        response_data: product,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                });
            }
            catch (error) {
                logger_1.logger.error(`Failed to get tours for destination ${params.destinationId}:`, error);
                if (axios_1.default.isAxiosError(error)) {
                    console.error("API Error Response:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                }
                throw error;
            }
        });
    }
    getTourDetails(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const tour = yield this.request(`/v1/products/${tourId}`);
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
                    rating: ((_a = tour.rating) === null || _a === void 0 ? void 0 : _a.overall) || null,
                    reviewCount: ((_b = tour.rating) === null || _b === void 0 ? void 0 : _b.reviewCount) || 0,
                    bookingLink: tour.bookingLink || '',
                    isFeatured: false,
                    totalCount: ((_c = tour.totalCount) === null || _c === void 0 ? void 0 : _c.toString()) || '0',
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }
            catch (error) {
                logger_1.logger.error(`Failed to get tour details for ${tourId}:`, error);
                throw error;
            }
        });
    }
    clearCache() {
        this.cachedDestinations.clear();
    }
}
exports.ViatorAPI = ViatorAPI;
// Create and export a singleton instance
exports.viatorAPI = new ViatorAPI();
exports.default = exports.viatorAPI;

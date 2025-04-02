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
exports.ToursController = void 0;
const locations_dao_1 = require("../dao/locations.dao");
const tours_dao_1 = require("../dao/tours.dao");
const api_response_1 = require("../utils/api-response");
const viator_1 = __importDefault(require("../integrations/viator"));
const logger_1 = require("../utils/logger");
const supabase_1 = require("../config/supabase"); // Assuming supabase connection is configured here
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || 'visitslovenia';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;
class ToursController {
    constructor() {
        this.verifyLocations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { locations } = req.body;
                if (!locations || !Array.isArray(locations) || locations.length === 0) {
                    return res.status(400).json((0, api_response_1.errorResponse)('Please provide valid locations array', 400));
                }
                // Filter out any empty or null locationIds
                const validLocations = locations.filter(locationId => locationId);
                // Verify only valid selected locations exist in Viator API
                const matches = {};
                for (const locationId of validLocations) {
                    try {
                        // Test fetch one tour to verify location exists
                        const tours = yield viator_1.default.getToursByCity({
                            destinationId: locationId,
                            limit: 1
                        });
                        matches[locationId] = tours[0] || null;
                    }
                    catch (error) {
                        logger_1.logger.error(`Failed to verify location ${locationId}:`, error);
                        matches[locationId] = null;
                    }
                }
                return res.status(200).json((0, api_response_1.successResponse)({ matches }, 'Locations verified successfully', 200));
            }
            catch (error) {
                logger_1.logger.error('Error verifying locations:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to verify locations', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.previewTours = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { locations, limit, page = 1 } = req.body;
                if (!locations || !Array.isArray(locations) || locations.length === 0) {
                    return res.status(400).json((0, api_response_1.errorResponse)('Please provide a valid locations array', 400));
                }
                const pageSize = limit || 100; // Default to 100 if no limit provided
                try {
                    // Fetch city and country details from Supabase before fetching tours
                    const { data: citiesData, error } = yield supabase_1.supabase
                        .from('cities') // Assuming 'cities' is your table name
                        .select('id, destination_id, destination_name, parent_id') // Select the fields for city and country
                        .in('destination_id', locations); // Fetch cities matching the provided destination IDs
                    if (error) {
                        logger_1.logger.error('Error fetching cities from Supabase:', error);
                        return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch cities data', 500));
                    }
                    // Map city and country info for quick lookup by destination_id
                    const cityMap = {};
                    citiesData === null || citiesData === void 0 ? void 0 : citiesData.forEach((city) => {
                        cityMap[city.destination_id] = {
                            cityName: city.destination_name, // City name
                            countryName: city.parent_id || '', // Parent ID could represent country or similar
                        };
                    });
                    // Fetch tours for each location with their own pagination
                    const locationResults = yield Promise.all(locations.map((locationId) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            // Get initial response to get totalCount
                            const response = yield viator_1.default.getToursByCity({
                                destinationId: locationId,
                                limit: pageSize,
                                page: page
                            });
                            // Get the total count from the response
                            const totalCount = (response === null || response === void 0 ? void 0 : response.length) > 0 ? parseInt(response[0].totalCount, 10) : 0;
                            // Calculate total pages using totalCount and pageSize
                            const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                            // Map the tours with city and country info from cityMap
                            const tours = Array.isArray(response) ? response.map((tour) => {
                                const cityInfo = cityMap[tour.destinationId]; // Fetch city and country info from cityMap
                                return Object.assign(Object.assign({}, tour), { location: {
                                        city: (cityInfo === null || cityInfo === void 0 ? void 0 : cityInfo.cityName) || tour.cityName || '', // City name from cityMap or fallback
                                        country: (cityInfo === null || cityInfo === void 0 ? void 0 : cityInfo.countryName) || '', // Country name from cityMap or fallback
                                        iataCode: tour.cityId || '',
                                        timeZone: ''
                                    }, productCode: tour.productCode || tour.id, productUrl: tour.bookingLink || tour.productUrl || '' });
                            }) : [];
                            return {
                                locationId,
                                tours,
                                pagination: {
                                    totalCount,
                                    currentPage: page,
                                    totalPages,
                                    hasMore: page < totalPages,
                                    pageSize
                                }
                            };
                        }
                        catch (error) {
                            logger_1.logger.error(`Failed to fetch tours for location ${locationId}:`, error);
                            return {
                                locationId,
                                tours: [],
                                pagination: {
                                    totalCount: 0,
                                    currentPage: page,
                                    totalPages: 1,
                                    hasMore: false,
                                    pageSize
                                }
                            };
                        }
                    })));
                    // Calculate overall totals
                    const overallTotal = locationResults.reduce((sum, location) => sum + location.pagination.totalCount, 0);
                    const maxTotalPages = Math.max(1, Math.max(...locationResults.map(loc => loc.pagination.totalPages)));
                    return res.status(200).json((0, api_response_1.successResponse)({
                        locations: locationResults,
                        overall: {
                            totalCount: overallTotal,
                            currentPage: page,
                            totalPages: maxTotalPages,
                            hasMore: page < maxTotalPages,
                            pageSize
                        }
                    }, 'Tours preview fetched successfully', 200));
                }
                catch (error) {
                    logger_1.logger.error(`Failed to fetch tours: ${error}`);
                    throw error;
                }
            }
            catch (error) {
                logger_1.logger.error('Error fetching tours preview:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch tours preview', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.importTour = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32;
            try {
                // Set headers for streaming response
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Transfer-Encoding', 'chunked');
                const { category, source, selectedLocations, limit, pages } = req.body;
                if (!selectedLocations || !Array.isArray(selectedLocations) || selectedLocations.length === 0) {
                    res.write(JSON.stringify({
                        type: 'toast',
                        message: 'Invalid Request',
                        description: 'Please provide valid locations array',
                        status: 'error'
                    }) + '\n');
                    return res.end();
                }
                const batchId = Date.now().toString();
                let totalImported = 0;
                let totalFailed = 0;
                let totalSkipped = 0;
                // Process each city
                for (const cityId of selectedLocations) {
                    try {
                        const currentPage = (pages === null || pages === void 0 ? void 0 : pages[cityId]) || 1;
                        // Starting import notification
                        res.write(JSON.stringify({
                            type: 'toast',
                            message: `Starting import for city ${cityId}`,
                            description: `Processing page ${currentPage}`,
                            status: 'info'
                        }) + '\n');
                        const tours = yield viator_1.default.getToursByCity({
                            destinationId: cityId,
                            limit: limit || 100,
                            page: currentPage
                        });
                        // Tours found notification
                        res.write(JSON.stringify({
                            type: 'toast',
                            message: `Found ${tours.length} tours`,
                            description: `For city ${cityId}`,
                            status: 'success'
                        }) + '\n');
                        for (const tour of tours) {
                            let productCode = '';
                            try {
                                productCode = ((_a = tour.response_data) === null || _a === void 0 ? void 0 : _a.productCode) || tour.productCode || '';
                                if (!productCode) {
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Missing Product Code',
                                        description: `No product code found for tour in city ${cityId}`,
                                        status: 'error'
                                    }) + '\n');
                                    totalFailed++;
                                    continue;
                                }
                                const { data: existingTour, error: checkError } = yield supabase_1.supabase
                                    .from('data_import')
                                    .select('id')
                                    .eq('product_code', productCode)
                                    .single();
                                if (checkError && checkError.code !== 'PGRST116') {
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Database Error',
                                        description: `Error checking existing tour ${productCode}`,
                                        status: 'error'
                                    }) + '\n');
                                    totalFailed++;
                                    continue;
                                }
                                if (existingTour) {
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Tour Exists',
                                        description: `Tour ${productCode} already exists, skipping...`,
                                        status: 'warning'
                                    }) + '\n');
                                    totalSkipped++;
                                    continue;
                                }
                                let uploadedImages = [];
                                const tourImages = ((_b = tour.response_data) === null || _b === void 0 ? void 0 : _b.images) || [];
                                const maxImages = 5;
                                res.write(JSON.stringify({
                                    type: 'toast',
                                    message: 'Processing Images',
                                    description: `Processing images for tour ${productCode}`,
                                    status: 'info'
                                }) + '\n');
                                // Process each image object
                                for (const imageObj of tourImages) {
                                    if (!imageObj.variants || !Array.isArray(imageObj.variants))
                                        continue;
                                    // Sort variants by resolution (width * height) in descending order
                                    const sortedVariants = [...imageObj.variants].sort((a, b) => (b.width * b.height) - (a.width * a.height));
                                    // Take only the top 5 highest resolution variants
                                    const topVariants = sortedVariants.slice(0, maxImages);
                                    // Upload each of the top variants
                                    for (let i = 0; i < topVariants.length && uploadedImages.length < maxImages; i++) {
                                        const variant = topVariants[i];
                                        try {
                                            if (variant.url) {
                                                res.write(JSON.stringify({
                                                    type: 'toast',
                                                    message: 'Uploading Image',
                                                    description: `Uploading image ${uploadedImages.length + 1}/${maxImages} (${variant.width}x${variant.height}) for tour ${productCode}`,
                                                    status: 'info'
                                                }) + '\n');
                                                const uploadedUrl = yield this.uploadImageToBunnyCDN(variant.url);
                                                if (uploadedUrl) {
                                                    uploadedImages.push({
                                                        original_url: variant.url,
                                                        uploaded_url: uploadedUrl,
                                                        width: variant.width,
                                                        height: variant.height,
                                                        upload_timestamp: new Date().toISOString()
                                                    });
                                                }
                                            }
                                        }
                                        catch (error) {
                                            res.write(JSON.stringify({
                                                type: 'toast',
                                                message: 'Image Upload Failed',
                                                description: `Failed to upload image ${uploadedImages.length + 1} for tour ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                                                status: 'error'
                                            }) + '\n');
                                        }
                                        // Break if we've reached the maximum number of images
                                        if (uploadedImages.length >= maxImages)
                                            break;
                                    }
                                    // Break the outer loop if we've reached the maximum number of images
                                    if (uploadedImages.length >= maxImages)
                                        break;
                                }
                                res.write(JSON.stringify({
                                    type: 'toast',
                                    message: 'Image Processing Complete',
                                    description: `Successfully processed ${uploadedImages.length} highest resolution images for tour ${productCode}`,
                                    status: 'success'
                                }) + '\n');
                                const importData = {
                                    source: source || 'VIATOR_API',
                                    category: category || 'TOURS',
                                    import_batch_id: batchId,
                                    response_data: tour.response_data || null,
                                    original_payload: tour.response_data || null,
                                    uploaded_images: uploadedImages,
                                    status: 'PROCESSING',
                                    metadata: {
                                        import_timestamp: new Date().toISOString(),
                                        city_id: cityId,
                                        city_name: tour.cityName || ((_c = tour.response_data) === null || _c === void 0 ? void 0 : _c.cityName) || '',
                                        country_name: tour.countryName || ((_d = tour.response_data) === null || _d === void 0 ? void 0 : _d.countryName) || '',
                                        page: currentPage
                                    },
                                    processed_data: {}, // Initialize empty processed_data
                                    selected_locations: selectedLocations,
                                    import_limit: limit,
                                    product_code: productCode,
                                    title: ((_e = tour.response_data) === null || _e === void 0 ? void 0 : _e.title) || '',
                                    description: ((_f = tour.response_data) === null || _f === void 0 ? void 0 : _f.description) || '',
                                    country: ((_g = tour.response_data) === null || _g === void 0 ? void 0 : _g.countryId) || tour.countryId || '',
                                    city: ((_h = tour.response_data) === null || _h === void 0 ? void 0 : _h.cityId) || tour.cityId || '',
                                    total_count: ((_j = tour.response_data) === null || _j === void 0 ? void 0 : _j.totalCount) || tour.totalCount || '0',
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                };
                                // First, check if tour type exists
                                const { data: existingTourType, error: checkTourTypeError } = yield supabase_1.supabase
                                    .from('tour_types')
                                    .select('id')
                                    .eq('name', ((_k = tour.response_data) === null || _k === void 0 ? void 0 : _k.title) || '')
                                    .single();
                                if (checkTourTypeError && checkTourTypeError.code !== 'PGRST116') {
                                    throw new Error(`Error checking existing tour type: ${checkTourTypeError.message}`);
                                }
                                let tourTypeId;
                                if (existingTourType) {
                                    // Update existing tour type
                                    const { data: updatedTourType, error: updateTourTypeError } = yield supabase_1.supabase
                                        .from('tour_types')
                                        .update({
                                        name: ((_l = tour.response_data) === null || _l === void 0 ? void 0 : _l.title) || '',
                                        description: ((_m = tour.response_data) === null || _m === void 0 ? void 0 : _m.description) || '',
                                        updated_at: new Date().toISOString()
                                    })
                                        .eq('id', existingTourType.id)
                                        .select('id')
                                        .single();
                                    if (updateTourTypeError) {
                                        throw new Error(`Failed to update tour type: ${updateTourTypeError.message}`);
                                    }
                                    tourTypeId = existingTourType.id;
                                }
                                else {
                                    // Insert new tour type
                                    const { data: newTourType, error: tourTypeError } = yield supabase_1.supabase
                                        .from('tour_types')
                                        .insert([{
                                            name: ((_o = tour.response_data) === null || _o === void 0 ? void 0 : _o.title) || '',
                                            description: ((_p = tour.response_data) === null || _p === void 0 ? void 0 : _p.description) || '',
                                            created_at: new Date().toISOString(),
                                            updated_at: new Date().toISOString()
                                        }])
                                        .select('id')
                                        .single();
                                    if (tourTypeError) {
                                        throw new Error(`Failed to create tour type: ${tourTypeError.message}`);
                                    }
                                    tourTypeId = newTourType.id;
                                }
                                // Get city_id from cities table
                                const { data: cityData, error: cityError } = yield supabase_1.supabase
                                    .from('cities')
                                    .select('id')
                                    .eq('destination_id', cityId)
                                    .single();
                                if (cityError) {
                                    throw new Error(`Failed to find city: ${cityError.message}`);
                                }
                                // Check if tour exists (rename to avoid redeclaration)
                                const { data: existingTourRecord, error: checkTourError } = yield supabase_1.supabase
                                    .from('tours')
                                    .select('id')
                                    .eq('name', ((_q = tour.response_data) === null || _q === void 0 ? void 0 : _q.title) || '')
                                    .eq('city_id', cityData.id)
                                    .single();
                                if (checkTourError && checkTourError.code !== 'PGRST116') {
                                    throw new Error(`Error checking existing tour: ${checkTourError.message}`);
                                }
                                let tourData;
                                if (existingTourRecord === null || existingTourRecord === void 0 ? void 0 : existingTourRecord.id) {
                                    // Update existing tour
                                    const tourUpdateData = this.cleanObject({
                                        name: (_r = tour.response_data) === null || _r === void 0 ? void 0 : _r.title,
                                        description: (_s = tour.response_data) === null || _s === void 0 ? void 0 : _s.description,
                                        city_id: cityData.id,
                                        tour_type_id: tourTypeId,
                                        duration: this.formatDuration({
                                            from: (_u = (_t = tour.response_data) === null || _t === void 0 ? void 0 : _t.duration) === null || _u === void 0 ? void 0 : _u.variableDurationFromMinutes,
                                            to: (_w = (_v = tour.response_data) === null || _v === void 0 ? void 0 : _v.duration) === null || _w === void 0 ? void 0 : _w.variableDurationToMinutes
                                        }),
                                        price: ((_z = (_y = (_x = tour.response_data) === null || _x === void 0 ? void 0 : _x.pricing) === null || _y === void 0 ? void 0 : _y.summary) === null || _z === void 0 ? void 0 : _z.fromPrice) || ((_1 = (_0 = tour.response_data) === null || _0 === void 0 ? void 0 : _0.price) === null || _1 === void 0 ? void 0 : _1.amount),
                                        booking_link: ((_2 = tour.response_data) === null || _2 === void 0 ? void 0 : _2.productUrl) || ((_3 = tour.response_data) === null || _3 === void 0 ? void 0 : _3.bookingLink),
                                        image_url: uploadedImages.length > 0 ? uploadedImages[0].uploaded_url || uploadedImages[0].original_url : '',
                                        included: (_5 = (_4 = tour.response_data) === null || _4 === void 0 ? void 0 : _4.inclusions) === null || _5 === void 0 ? void 0 : _5.filter(Boolean).join('\n'),
                                        additional: (_7 = (_6 = tour.response_data) === null || _6 === void 0 ? void 0 : _6.additionalInfo) === null || _7 === void 0 ? void 0 : _7.filter(Boolean).join('\n'),
                                        policy: (_9 = (_8 = tour.response_data) === null || _8 === void 0 ? void 0 : _8.flags) === null || _9 === void 0 ? void 0 : _9.filter(Boolean).join(', '),
                                        rating: ((_11 = (_10 = tour.response_data) === null || _10 === void 0 ? void 0 : _10.reviews) === null || _11 === void 0 ? void 0 : _11.combinedAverageRating) || 0,
                                        updated_at: new Date().toISOString()
                                    });
                                    const { data: updatedTour, error: updateTourError } = yield supabase_1.supabase
                                        .from('tours')
                                        .update(tourUpdateData)
                                        .eq('id', existingTourRecord.id)
                                        .select('*')
                                        .single();
                                    if (updateTourError) {
                                        throw new Error(`Failed to update tour: ${updateTourError.message}`);
                                    }
                                    tourData = updatedTour;
                                }
                                else {
                                    // Insert new tour
                                    const tourInsertData = this.cleanObject({
                                        name: (_12 = tour.response_data) === null || _12 === void 0 ? void 0 : _12.title,
                                        description: (_13 = tour.response_data) === null || _13 === void 0 ? void 0 : _13.description,
                                        city_id: cityData.id,
                                        tour_type_id: tourTypeId,
                                        duration: this.formatDuration({
                                            from: (_15 = (_14 = tour.response_data) === null || _14 === void 0 ? void 0 : _14.duration) === null || _15 === void 0 ? void 0 : _15.variableDurationFromMinutes,
                                            to: (_17 = (_16 = tour.response_data) === null || _16 === void 0 ? void 0 : _16.duration) === null || _17 === void 0 ? void 0 : _17.variableDurationToMinutes
                                        }),
                                        price: ((_20 = (_19 = (_18 = tour.response_data) === null || _18 === void 0 ? void 0 : _18.pricing) === null || _19 === void 0 ? void 0 : _19.summary) === null || _20 === void 0 ? void 0 : _20.fromPrice) || ((_22 = (_21 = tour.response_data) === null || _21 === void 0 ? void 0 : _21.price) === null || _22 === void 0 ? void 0 : _22.amount),
                                        booking_link: ((_23 = tour.response_data) === null || _23 === void 0 ? void 0 : _23.productUrl) || ((_24 = tour.response_data) === null || _24 === void 0 ? void 0 : _24.bookingLink),
                                        image_url: uploadedImages.length > 0 ? uploadedImages[0].uploaded_url || uploadedImages[0].original_url : '',
                                        is_featured: false,
                                        included: (_26 = (_25 = tour.response_data) === null || _25 === void 0 ? void 0 : _25.inclusions) === null || _26 === void 0 ? void 0 : _26.filter(Boolean).join('\n'),
                                        additional: (_28 = (_27 = tour.response_data) === null || _27 === void 0 ? void 0 : _27.additionalInfo) === null || _28 === void 0 ? void 0 : _28.filter(Boolean).join('\n'),
                                        policy: (_30 = (_29 = tour.response_data) === null || _29 === void 0 ? void 0 : _29.flags) === null || _30 === void 0 ? void 0 : _30.filter(Boolean).join(', '),
                                        rating: ((_32 = (_31 = tour.response_data) === null || _31 === void 0 ? void 0 : _31.reviews) === null || _32 === void 0 ? void 0 : _32.combinedAverageRating) || 0,
                                        created_at: new Date().toISOString(),
                                        updated_at: new Date().toISOString()
                                    });
                                    const { data: newTour, error: tourError } = yield supabase_1.supabase
                                        .from('tours')
                                        .insert([tourInsertData])
                                        .select('*')
                                        .single();
                                    if (tourError) {
                                        throw new Error(`Failed to create tour: ${tourError.message}`);
                                    }
                                    tourData = newTour;
                                }
                                // Log the importData before inserting
                                const { data: insertedData, error: importError } = yield supabase_1.supabase
                                    .from('data_import')
                                    .insert([Object.assign(Object.assign({}, importData), { processed_data: Object.assign(Object.assign({}, importData.processed_data), { tour_type_id: tourTypeId, tour_id: tourData.id }) })])
                                    .select('*')
                                    .single();
                                if (importError) {
                                    console.error('Database insert error:', importError);
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Import Failed',
                                        description: `Failed to store import data for tour ${productCode}: ${importError.message}`,
                                        status: 'error'
                                    }) + '\n');
                                    totalFailed++;
                                    continue;
                                }
                                res.write(JSON.stringify({
                                    type: 'toast',
                                    message: 'Data Stored',
                                    description: `Successfully stored data for tour ${productCode}`,
                                    status: 'success'
                                }) + '\n');
                                const { error: updateError } = yield supabase_1.supabase
                                    .from('data_import')
                                    .update({
                                    status: 'COMPLETED',
                                    processed_data: Object.assign(Object.assign({}, insertedData.processed_data), { tour_type: tourTypeId, tour: tourData }),
                                    updated_at: new Date().toISOString()
                                })
                                    .eq('import_batch_id', batchId)
                                    .eq('product_code', productCode);
                                if (updateError) {
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Update Failed',
                                        description: `Failed to update import status for tour ${productCode}`,
                                        status: 'error'
                                    }) + '\n');
                                    totalFailed++;
                                }
                                else {
                                    totalImported++;
                                    res.write(JSON.stringify({
                                        type: 'toast',
                                        message: 'Tour Imported',
                                        description: `Successfully imported tour ${productCode}`,
                                        status: 'success'
                                    }) + '\n');
                                }
                            }
                            catch (error) {
                                totalFailed++;
                                res.write(JSON.stringify({
                                    type: 'toast',
                                    message: 'Processing Failed',
                                    description: `Failed to process tour ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                                    status: 'error'
                                }) + '\n');
                                yield supabase_1.supabase
                                    .from('data_import')
                                    .update({
                                    status: 'FAILED',
                                    error_message: error instanceof Error ? error.message : 'Unknown error',
                                    updated_at: new Date().toISOString()
                                })
                                    .eq('import_batch_id', batchId)
                                    .eq('product_code', productCode);
                            }
                        }
                        res.write(JSON.stringify({
                            type: 'toast',
                            message: 'City Processing Complete',
                            description: `Completed processing city ${cityId}: ${totalImported} imported, ${totalSkipped} skipped, ${totalFailed} failed`,
                            status: 'info'
                        }) + '\n');
                    }
                    catch (error) {
                        res.write(JSON.stringify({
                            type: 'toast',
                            message: 'City Processing Failed',
                            description: `Failed to fetch tours for city ${cityId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            status: 'error'
                        }) + '\n');
                        totalFailed++;
                    }
                }
                const summary = {
                    batchId,
                    imported: totalImported,
                    failed: totalFailed,
                    skipped: totalSkipped,
                    total: totalImported + totalFailed + totalSkipped
                };
                // Final summary toast
                res.write(JSON.stringify({
                    type: 'toast',
                    message: 'Import Complete',
                    description: `Successfully imported: ${totalImported}, Skipped: ${totalSkipped}, Failed: ${totalFailed}, Total: ${summary.total}`,
                    status: 'success'
                }) + '\n');
                // Send the final summary as a special message type
                res.write(JSON.stringify({
                    type: 'summary',
                    data: summary,
                    message: `Import completed with the following results:
           - Successfully imported: ${totalImported} tours
           - Skipped (already exist): ${totalSkipped} tours
           - Failed to import: ${totalFailed} tours
           - Total processed: ${totalImported + totalFailed + totalSkipped} tours`,
                    status: 'success'
                }) + '\n');
                // End the response stream
                return res.end();
            }
            catch (error) {
                res.write(JSON.stringify({
                    type: 'toast',
                    message: 'Import Process Failed',
                    description: error instanceof Error ? error.message : 'Unknown error',
                    status: 'error'
                }) + '\n');
                // Send error summary and end the stream
                res.write(JSON.stringify({
                    type: 'summary',
                    status: 'error',
                    message: 'Import process failed with error: ' + (error instanceof Error ? error.message : 'Unknown error'),
                    error: error instanceof Error ? error.message : 'Unknown error'
                }) + '\n');
                return res.end();
            }
        });
        this.resetTours = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.toursDao.deleteAllTours();
                return res.status(200).json((0, api_response_1.successResponse)(null, 'All tours have been deleted successfully', 200));
            }
            catch (error) {
                logger_1.logger.error('Error resetting tours:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to reset tours', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.createTour = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tourData = req.body;
                if (!tourData) {
                    return res.status(400).json((0, api_response_1.errorResponse)('Please provide tour data', 400));
                }
                // Generate a unique batch ID if not provided
                const batchId = ((_a = tourData.import_metadata) === null || _a === void 0 ? void 0 : _a.import_batch_id) || Date.now().toString();
                // First, store the original data in data_import table
                const importData = {
                    source: tourData.import_metadata.source,
                    category: tourData.import_metadata.category,
                    import_batch_id: batchId,
                    original_payload: tourData.import_metadata.original_payload,
                    processed_data: tourData,
                    status: 'PROCESSING',
                    metadata: {
                        import_timestamp: tourData.import_metadata.imported_at,
                        city_id: tourData.city_id,
                        city_name: tourData.city_name,
                        country_name: tourData.country_name
                    },
                    selected_locations: tourData.import_metadata.selected_locations,
                    import_limit: tourData.import_metadata.import_limit
                };
                // Insert into data_import table
                const { error: importError } = yield supabase_1.supabase
                    .from('data_import')
                    .insert([importData]);
                if (importError) {
                    logger_1.logger.error('Error storing import data:', importError);
                    throw importError;
                }
                try {
                    // Upload images to BunnyCDN if present
                    if (tourData.images && Array.isArray(tourData.images)) {
                        const uploadedImages = yield Promise.all(tourData.images.map((imageUrl) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                return yield this.uploadImageToBunnyCDN(imageUrl);
                            }
                            catch (error) {
                                logger_1.logger.error(`Failed to upload image ${imageUrl}:`, error);
                                return null;
                            }
                        })));
                        // Filter out any failed uploads
                        tourData.images = uploadedImages.filter(url => url !== null);
                    }
                    // Insert tour data into tours table
                    const { data: tourResult, error: tourError } = yield supabase_1.supabase
                        .from('tours')
                        .insert([tourData])
                        .select()
                        .single();
                    if (tourError) {
                        throw tourError;
                    }
                    // Update data_import status to COMPLETED
                    const { error: updateError } = yield supabase_1.supabase
                        .from('data_import')
                        .update({
                        status: 'COMPLETED',
                        processed_data: tourResult,
                        updated_at: new Date().toISOString()
                    })
                        .eq('import_batch_id', batchId)
                        .eq('original_payload->productCode', tourData.viator_id);
                    if (updateError) {
                        logger_1.logger.error('Error updating import status:', updateError);
                    }
                    return res.status(200).json((0, api_response_1.successResponse)(tourResult, 'Tour created successfully', 200));
                }
                catch (error) {
                    // Update data_import status to FAILED
                    const { error: updateError } = yield supabase_1.supabase
                        .from('data_import')
                        .update({
                        status: 'FAILED',
                        error_message: error instanceof Error ? error.message : 'Unknown error',
                        updated_at: new Date().toISOString()
                    })
                        .eq('import_batch_id', batchId)
                        .eq('original_payload->productCode', tourData.viator_id);
                    if (updateError) {
                        logger_1.logger.error('Error updating import status:', updateError);
                    }
                    throw error;
                }
            }
            catch (error) {
                logger_1.logger.error('Error creating tour:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to create tour', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.getImportedData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: importedData, error } = yield supabase_1.supabase
                    .from('data_import')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) {
                    logger_1.logger.error('Error fetching imported data:', error);
                    return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch imported data', 500, error.message));
                }
                return res.status(200).json((0, api_response_1.successResponse)(importedData, 'Imported data fetched successfully', 200));
            }
            catch (error) {
                logger_1.logger.error('Error fetching imported data:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch imported data', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.locationsDao = new locations_dao_1.LocationsDAO();
        this.toursDao = new tours_dao_1.ToursDAO();
    }
    uploadImageToBunnyCDN(imageUrl_1) {
        return __awaiter(this, arguments, void 0, function* (imageUrl, folder = '/uploads/tours') {
            try {
                // Generate a unique filename using timestamp and random string
                //   const timestamp = Date.now();
                //   const randomString = Math.random().toString(36).substring(7);
                //   const extension = path.extname(imageUrl) || '.jpg';
                //   const fileName = `${timestamp}_${randomString}${extension}`;
                //   const bunnyUploadUrl = `${BUNNY_BASE_URL}/${folder}/${fileName}`;
                const originalFileName = path_1.default.basename(imageUrl);
                const extension = path_1.default.extname(imageUrl) || '.jpg';
                const timestamp = Date.now();
                const fileName = `${timestamp}_${originalFileName}`;
                const bunnyUploadUrl = `${BUNNY_BASE_URL}/${folder}/${fileName}`;
                // Download image from source
                const imageResponse = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                // Upload to BunnyCDN
                yield axios_1.default.put(bunnyUploadUrl, imageBuffer, {
                    headers: {
                        'AccessKey': BUNNY_API_KEY,
                        'Content-Type': 'application/octet-stream',
                    },
                });
                // Return the CDN URL
                return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${folder}/${fileName}`;
            }
            catch (error) {
                logger_1.logger.error('Error uploading image to BunnyCDN:', error);
                throw new Error('Failed to upload image to BunnyCDN');
            }
        });
    }
    formatDuration(minutes) {
        if (typeof minutes === 'string')
            return minutes;
        const from = minutes.from || 0;
        const to = minutes.to || from;
        if (from === 0 && to === 0)
            return '';
        // Convert minutes to appropriate format
        if (from >= 1440 || to >= 1440) { // More than 24 hours
            const days = Math.ceil(to / 1440);
            return `${days} ${days === 1 ? 'Day' : 'Days'}`;
        }
        else if (from >= 360) { // 6 hours or more
            return 'Full Day';
        }
        else if (from >= 240) { // 4 hours or more
            return 'Half Day';
        }
        else if (from === to) {
            const hours = Math.floor(from / 60);
            const mins = from % 60;
            if (hours > 0) {
                return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
            }
            return `${mins}m`;
        }
        else {
            const fromHours = Math.floor(from / 60);
            const fromMins = from % 60;
            const toHours = Math.floor(to / 60);
            const toMins = to % 60;
            let duration = '';
            if (fromHours > 0) {
                duration += `${fromHours}-${toHours}h`;
                if (fromMins > 0 || toMins > 0) {
                    duration += ` ${fromMins}-${toMins}m`;
                }
            }
            else {
                duration += `${fromMins}-${toMins}m`;
            }
            return duration;
        }
    }
    cleanObject(obj) {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined && value !== null && value !== '') {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }
}
exports.ToursController = ToursController;

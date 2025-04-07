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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToursDAO = void 0;
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
class ToursDAO {
    constructor() {
        this.tableName = 'tours';
    }
    createTour(tour) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert the tour object to match the database schema
                const dbTour = {
                    id: tour.id,
                    viator_id: tour.viator_id,
                    title: tour.title,
                    description: tour.description,
                    price: tour.price,
                    currency: tour.currency,
                    duration: tour.duration,
                    city_id: tour.cityId,
                    city_name: tour.cityName,
                    destination_id: tour.destinationId,
                    images: tour.images,
                    booking_type: tour.bookingType,
                    cancellation_policy: tour.cancellationPolicy,
                    highlights: tour.highlights,
                    inclusions: tour.inclusions,
                    exclusions: tour.exclusions,
                    additional_info: tour.additionalInfo,
                    starting_time: tour.startingTime,
                    languages: tour.languages,
                    categories: tour.categories,
                    rating: tour.rating,
                    review_count: tour.reviewCount,
                    booking_link: tour.bookingLink,
                    is_featured: tour.isFeatured,
                    status: tour.status,
                    created_at: tour.createdAt,
                    updated_at: tour.updatedAt
                };
                const { data, error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .insert([dbTour])
                    .select()
                    .single();
                if (error)
                    throw error;
                // Convert the database response back to the Tour interface format
                return this.convertDbTourToTour(data);
            }
            catch (error) {
                logger_1.logger.error('Error creating tour:', error);
                throw error;
            }
        });
    }
    upsertTour(tour) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbTour = {
                    id: tour.id,
                    viator_id: tour.viator_id,
                    title: tour.title,
                    description: tour.description,
                    price: tour.price,
                    currency: tour.currency,
                    duration: tour.duration,
                    city_id: tour.cityId,
                    city_name: tour.cityName,
                    destination_id: tour.destinationId,
                    images: tour.images,
                    booking_type: tour.bookingType,
                    cancellation_policy: tour.cancellationPolicy,
                    highlights: tour.highlights,
                    inclusions: tour.inclusions,
                    exclusions: tour.exclusions,
                    additional_info: tour.additionalInfo,
                    starting_time: tour.startingTime,
                    languages: tour.languages,
                    categories: tour.categories,
                    rating: tour.rating,
                    review_count: tour.reviewCount,
                    booking_link: tour.bookingLink,
                    is_featured: tour.isFeatured,
                    status: tour.status,
                    created_at: tour.createdAt,
                    updated_at: tour.updatedAt
                };
                const { data, error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .upsert([dbTour], {
                    onConflict: 'id',
                    ignoreDuplicates: false
                })
                    .select()
                    .single();
                if (error)
                    throw error;
                return this.convertDbTourToTour(data);
            }
            catch (error) {
                logger_1.logger.error('Error upserting tour:', error);
                throw error;
            }
        });
    }
    convertDbTourToTour(dbTour) {
        return {
            id: dbTour.id,
            viator_id: dbTour.viator_id,
            title: dbTour.title,
            description: dbTour.description,
            price: dbTour.price,
            currency: dbTour.currency,
            duration: dbTour.duration,
            cityId: dbTour.city_id,
            cityName: dbTour.city_name,
            destinationId: dbTour.destination_id,
            images: dbTour.images,
            bookingType: dbTour.booking_type,
            cancellationPolicy: dbTour.cancellation_policy,
            highlights: dbTour.highlights,
            inclusions: dbTour.inclusions,
            exclusions: dbTour.exclusions,
            additionalInfo: dbTour.additional_info,
            startingTime: dbTour.starting_time,
            languages: dbTour.languages,
            categories: dbTour.categories,
            rating: dbTour.rating,
            reviewCount: dbTour.review_count,
            bookingLink: dbTour.booking_link,
            isFeatured: dbTour.is_featured,
            status: dbTour.status,
            createdAt: new Date(dbTour.created_at),
            updatedAt: new Date(dbTour.updated_at)
        };
    }
    deleteAllTours() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .delete()
                    .neq('id', '');
                if (error)
                    throw error;
            }
            catch (error) {
                logger_1.logger.error('Error deleting all tours:', error);
                throw error;
            }
        });
    }
    getTourById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .select('*')
                    .eq('id', id)
                    .single();
                if (error)
                    throw error;
                return data ? this.convertDbTourToTour(data) : null;
            }
            catch (error) {
                logger_1.logger.error(`Error getting tour by id ${id}:`, error);
                throw error;
            }
        });
    }
    getToursByCity(cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .select('*')
                    .eq('city_id', cityId);
                if (error)
                    throw error;
                return (data || []).map(dbTour => this.convertDbTourToTour(dbTour));
            }
            catch (error) {
                logger_1.logger.error(`Error getting tours by city ${cityId}:`, error);
                throw error;
            }
        });
    }
    getTourByViatorId(viatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from(this.tableName)
                    .select('*')
                    .eq('viator_id', viatorId)
                    .single();
                if (error)
                    throw error;
                return data ? this.convertDbTourToTour(data) : null;
            }
            catch (error) {
                logger_1.logger.error(`Error getting tour by Viator ID ${viatorId}:`, error);
                throw error;
            }
        });
    }
}
exports.ToursDAO = ToursDAO;

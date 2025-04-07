import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface Tour {
  id: string;
  viator_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  cityId: string;
  cityName: string;
  destinationId: string;
  images: string[];
  bookingType: string;
  cancellationPolicy: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  additionalInfo: string[];
  startingTime: string;
  languages: string[];
  categories: string[];
  rating: number | null;
  reviewCount: number;
  bookingLink: string;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: Date;
  updatedAt: Date;
}

export class ToursDAO {
  private readonly tableName = 'tours';

  async createTour(tour: Tour): Promise<Tour> {
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

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([dbTour])
        .select()
        .single();

      if (error) throw error;

      // Convert the database response back to the Tour interface format
      return this.convertDbTourToTour(data);
    } catch (error) {
      logger.error('Error creating tour:', error);
      throw error;
    }
  }

  async upsertTour(tour: Tour): Promise<Tour> {
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

      const { data, error } = await supabase
        .from(this.tableName)
        .upsert([dbTour], {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;
      return this.convertDbTourToTour(data);
    } catch (error) {
      logger.error('Error upserting tour:', error);
      throw error;
    }
  }

  private convertDbTourToTour(dbTour: any): Tour {
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

  async deleteAllTours(): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .neq('id', '');

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting all tours:', error);
      throw error;
    }
  }

  async getTourById(id: string): Promise<Tour | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.convertDbTourToTour(data) : null;
    } catch (error) {
      logger.error(`Error getting tour by id ${id}:`, error);
      throw error;
    }
  }

  async getToursByCity(cityId: string): Promise<Tour[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('city_id', cityId);

      if (error) throw error;
      return (data || []).map(dbTour => this.convertDbTourToTour(dbTour));
    } catch (error) {
      logger.error(`Error getting tours by city ${cityId}:`, error);
      throw error;
    }
  }

  async getTourByViatorId(viatorId: string): Promise<Tour | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('viator_id', viatorId)
        .single();

      if (error) throw error;
      return data ? this.convertDbTourToTour(data) : null;
    } catch (error) {
      logger.error(`Error getting tour by Viator ID ${viatorId}:`, error);
      throw error;
    }
  }
} 
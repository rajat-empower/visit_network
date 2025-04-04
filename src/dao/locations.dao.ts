import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { CityData } from './city.dao';

export interface LocationMapping {
  id?: string;
  country_id: number;
  city_id: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface MappedCity {
  id: string;
  name: string;
  destinationId: string;
  countryId: string;
  regionId?: string;
}

export class LocationsDAO {
  async deleteAllMappings() {
    const { error } = await supabase
      .from('locations_mapping')
      .delete()
      .neq('id', '0'); // Ensure we're not using a blank where clause

    if (error) {
      console.error('Error deleting mappings:', error);
      throw error;
    }
  }

  async createMappings(mappings: LocationMapping[]) {
    const { data, error } = await supabase
      .from('locations_mapping')
      .insert(mappings)
      .select();

    if (error) {
      console.error('Error creating mappings:', error);
      throw error;
    }

    return data;
  }

  async getMappedCities(): Promise<MappedCity[]> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select(`
          id,
          name,
          destination_id,
          parent_id,
          time_zone
        `);

      if (error) throw error;

      return data.map(city => ({
        id: city.id,
        name: city.name,
        destinationId: city.destination_id,
        countryId: city.parent_id,
        regionId: city.time_zone
      }));
    } catch (error) {
      logger.error('Failed to get mapped cities:', error);
      throw error;
    }
  }

  async getAllMappings() {
    const { data, error } = await supabase
      .from('locations_mapping')
      .select('*');

    if (error) {
      console.error('Error fetching mappings:', error);
      throw error;
    }

    return data;
  }

  // City-related functions
  async getCityById(id: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('destination_id', id)
      .single();

    if (error) {
      console.error('Error fetching city:', error);
      throw error;
    }

    return data;
  }

  async getCityByName(name: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking city existence:', error);
      throw error;
    }

    return data;
  }

  async upsertCity(cityData: CityData) {
    // Remove any undefined or null values
    const cleanedData = Object.fromEntries(
      Object.entries(cityData).filter(([_, v]) => v != null)
    );

    const { data, error } = await supabase
      .from('cities')
      .upsert(cleanedData)
      .select()
      .single();

    if (error) {
      console.error('Error upserting city:', error);
      throw error;
    }

    return data;
  }

  async updateCity(id: string, updateData: Partial<CityData>) {
    // Remove any undefined or null values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v != null)
    );

    const { data, error } = await supabase
      .from('cities')
      .update(cleanedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating city:', error);
      throw error;
    }

    return data;
  }

  async updateCityDetails(id: string, updateData: Partial<CityData>) {
    // Remove any undefined or null values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v != null)
    );

    const { data, error } = await supabase
      .from('cities')
      .update(cleanedData)
      .eq('destination_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating city:', error);
      throw error;
    }

    return data;
  }

  async getAllCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }

    return data;
  }

  async deleteCityById(id: string) {
    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }
} 
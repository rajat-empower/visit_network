import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface LocationMapping {
  country_id: number;
  city_id: number;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
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
      .gt('id', 0);

    if (error) throw error;
  }

  async createMappings(mappings: LocationMapping[]) {
    const { data, error } = await supabase
      .from('locations_mapping')
      .insert(mappings.map(mapping => ({
        ...mapping,
        created_by: 'system',
        updated_by: 'system'
      })))
      .select();

    if (error) throw error;
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
    try {
      const { data, error } = await supabase
        .from('locations_mapping')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get all mappings:', error);
      throw error;
    }
  }
} 
import { supabase } from '../config/supabase';

export interface LocationMapping {
  city_id: string;
  region: string;
  created_at: string;
  updated_at: string;
}

export class LocationsDAO {
  async getUniqueRegions() {
    const { data, error } = await supabase
      .from('cities')
      .select('region')
      .not('region', 'is', null);

    if (error) throw error;
    return data;
  }

  async getCitiesByRegions(regions: string[]) {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('region', regions);

    if (error) throw error;
    return data;
  }

  async deleteAllMappings() {
    const { error } = await supabase
      .from('locations_mapping')
      .delete()
      .neq('region', 'NO_SUCH_REGION');

    if (error) throw error;
  }

  async validateCityIds(cityIds: string[]) {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('id', cityIds);

    if (error) throw error;
    return data;
  }

  async createMappings(mappings: LocationMapping[]) {
    const { data, error } = await supabase
      .from('locations_mapping')
      .insert(mappings)
      .select();

    if (error) throw error;
    return data;
  }

  async getAllMappings() {
    const { data, error } = await supabase
      .from('locations_mapping')
      .select(`
        city_id,
        region,
        cities (
          id,
          name,
          region
        )
      `);

    if (error) throw error;
    return data;
  }
} 
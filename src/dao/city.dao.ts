import { supabase } from '../config/supabase';

export interface CityData {
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  type?: string;
  region?: string;
  viator_id?: string;
  popularity?: number;
  population?: number;
  bestvisit?: string;
  toptourist?: string;
  hiddengems?: string;
  annualevents?: string;
  food?: string;
  transport?: string;
  active?: boolean;
  destination_id?: string;
  destination_name?: string;
  destination_type?: string;
  parent_id?: string;
  time_zone?: string;
  iata_code?: string;
  sort_order?: number;
  lookup_id?: string;
  id?: string;
}

export class CityDAO {
  async getAllCities(): Promise<CityData[]> {
    console.log('Fetching all cities');
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }

    return data || [];
  }

  async upsertCity(city: CityData) {
    console.log('Upserting city:', city);
    const { data, error } = await supabase
      .from('cities')
      .upsert([city])
      .select();

    if (error) {
      console.error('Error upserting city:', error);
      throw error;
    }

    return data;
  }

  async upsertCities(cities: CityData[]) {
    console.log('Upserting cities:', cities);
    const { data, error } = await supabase
      .from('cities')
      .upsert(cities)
      .select();

    if (error) {
      console.error('Error upserting cities:', error);
      throw error;
    }

    return data;
  }

  async getCityByName(name: string): Promise<CityData | null> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('name', name)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting city by name:', error);
      return null;
    }
  }

  async getCityByViatorId(viatorId: string): Promise<CityData | null> {
    console.log('Fetching city by viator_id:', viatorId);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('viator_id', viatorId)
      .single();

    if (error) throw error;
    console.log('City fetch result:', JSON.stringify(data, null, 2));
    return data;
  }

  async getCityByDestinationId(destinationId: string): Promise<CityData | null> {
    console.log('Fetching city by destination_id:', destinationId);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('destination_id', destinationId)
      .single();

    if (error) throw error;
    console.log('City fetch result:', JSON.stringify(data, null, 2));
    return data;
  }

  async getCityById(id: string): Promise<CityData | null> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('destination_id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting city by ID:', error);
      return null;
    }
  }

  async updateCity(id: string, updateData: Partial<CityData>): Promise<CityData | null> {
    try {
      // Remove undefined values from updateData
      const cleanedData = Object.entries(updateData)
        .reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

      const { data, error } = await supabase
        .from('cities')
        .update(cleanedData)
        .eq('destination_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating city:', error);
      return null;
    }
  }
} 
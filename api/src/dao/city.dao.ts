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

  async getCityByName(name: string) {
    console.log('Checking if city exists:', name);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error checking city existence:', error);
      throw error;
    }

    return data;
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

  async updateCity(id: string, updateData: Partial<CityData>) {
    console.log('Updating city with ID:', id, 'Data:', updateData);
    const { data, error } = await supabase
      .from('cities')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating city:', error);
      throw error;
    }

    return data;
  }
} 
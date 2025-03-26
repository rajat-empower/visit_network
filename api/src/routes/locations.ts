import express from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Get all countries
router.get('/countries', async (req: express.Request, res: express.Response) => {
  try {
    const { data: countries, error } = await supabase
      .from('cities')
      .select('region')
      .not('region', 'is', null);

    if (error) throw error;

    // Handle uniqueness in JavaScript
    const uniqueCountries = [...new Set(countries.map(item => item.region))];
    res.json(uniqueCountries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get cities by countries
router.get('/cities', async (req: express.Request, res: express.Response) => {
  try {
    const countries = req.query.countries as string;
    if (!countries) {
      return res.status(400).json({ error: 'Countries parameter is required' });
    }

    const countriesList = countries.split(',');
    
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('region', countriesList);

    if (error) throw error;

    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Save country-city mapping
interface RegionMappings {
  [region: string]: number[];
}

router.post('/mapping', async (req: express.Request, res: express.Response) => {
  try {
    const { mappings } = req.body;
    if (!mappings || typeof mappings !== 'object') {
      return res.status(400).json({ error: 'mappings object is required' });
    }

    // Get all unique cityIds
    const allCityIds = [...new Set(
      Object.values(mappings).flat()
    )];

    // First, get all cities data
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('id', allCityIds);

    if (fetchError) throw fetchError;

    // Create all mappings
    const allMappings = Object.entries(mappings as RegionMappings).flatMap(([region, cityIds]) =>
      cityIds.map((cityId: number) => ({
        city_id: cityId,
        region: region,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    );

    // Insert all mappings
    const { data: savedMappings, error: insertError } = await supabase
      .from('locations_mapping')
      .insert(allMappings)
      .select();

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw insertError;
    }

    res.json(savedMappings);
  } catch (error) {
    console.error('Error saving city mapping:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to save city mapping' });
  }
});

export default router; 
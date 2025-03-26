import express from 'express';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/api-response';

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
    
    return res.status(200).json(
      successResponse(
        uniqueCountries,
        'Countries fetched successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching countries:', error);
    return res.status(500).json(
      errorResponse(
        'Failed to fetch countries',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      )
    );
  }
});

// Get cities by countries
router.get('/cities', async (req: express.Request, res: express.Response) => {
  try {
    const countries = req.query.countries as string;
    if (!countries) {
      return res.status(400).json(
        errorResponse(
          'Countries parameter is required',
          400
        )
      );
    }

    const countriesList = countries.split(',');
    
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('region', countriesList);

    if (error) throw error;

    return res.status(200).json(
      successResponse(
        cities,
        'Cities fetched successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json(
      errorResponse(
        'Failed to fetch cities',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      )
    );
  }
});

// Save country-city mapping
interface RegionMappings {
  [region: string]: string[];
}

router.post('/mapping', async (req: express.Request, res: express.Response) => {
  try {
    const { mappings } = req.body;
    if (!mappings || typeof mappings !== 'object') {
      return res.status(400).json(
        errorResponse(
          'Please provide valid region and city mappings',
          400
        )
      );
    }

    // Delete all existing mappings with a safe WHERE clause
    const { error: deleteError } = await supabase
      .from('locations_mapping')
      .delete()
      .neq('region', 'NO_SUCH_REGION');

    if (deleteError) {
      console.error('Delete Error:', deleteError);
      throw new Error('Failed to remove existing location mappings');
    }

    // Get all unique cityIds
    const allCityIds = [...new Set(
      Object.values(mappings).flat()
    )];

    if (allCityIds.length === 0) {
      return res.status(200).json(
        successResponse(
          null,
          'All location mappings have been cleared successfully',
          200
        )
      );
    }

    // First, get all cities data to validate the IDs
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('id, name, region')
      .in('id', allCityIds);

    if (fetchError) throw new Error('Failed to validate city data');

    if (!cities || cities.length !== allCityIds.length) {
      return res.status(400).json(
        errorResponse(
          'Some of the selected cities could not be found',
          400
        )
      );
    }

    // Create all mappings
    const allMappings = Object.entries(mappings as RegionMappings).flatMap(([region, cityIds]) =>
      cityIds.map((cityId: string) => ({
        city_id: cityId,
        region: region,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    );

    // Insert new mappings
    const { data: savedMappings, error: insertError } = await supabase
      .from('locations_mapping')
      .insert(allMappings)
      .select();

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw new Error('Failed to save new location mappings');
    }

    // Count regions and cities for the success message
    const regionCount = Object.keys(mappings).length;
    const cityCount = allCityIds.length;

    return res.status(200).json(
      successResponse(
        savedMappings,
        `Successfully updated ${cityCount} ${cityCount === 1 ? 'city' : 'cities'} in ${regionCount} ${regionCount === 1 ? 'region' : 'regions'}`,
        200
      )
    );
  } catch (error) {
    console.error('Error updating city mapping:', error);
    return res.status(500).json(
      errorResponse(
        error instanceof Error ? error.message : 'Failed to update location mappings',
        500
      )
    );
  }
});

// Get existing mappings
router.get('/mappings', async (req: express.Request, res: express.Response) => {
  try {
    const { data: mappings, error } = await supabase
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

    // Transform the data into a more usable format
    const regionMappings: { [key: string]: string[] } = {};
    const citiesData: { [key: string]: any } = {};

    mappings?.forEach(mapping => {
      if (!regionMappings[mapping.region]) {
        regionMappings[mapping.region] = [];
      }
      regionMappings[mapping.region].push(mapping.city_id);

      if (mapping.cities) {
        citiesData[mapping.city_id] = mapping.cities;
      }
    });

    return res.status(200).json(
      successResponse(
        { regionMappings, citiesData },
        'Location Mappings fetched successfully',
        200
      )
    );
  } catch (error) {
    console.error('Error fetching mappings:', error);
    return res.status(500).json(
      errorResponse(
        'Failed to fetch Location mappings',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      )
    );
  }
});

export default router; 
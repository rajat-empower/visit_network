import { Request, Response } from 'express';
import { LocationsDAO, LocationMapping } from '../dao/locations.dao';
import { successResponse, errorResponse } from '../utils/api-response';

export class LocationsController {
  private locationsDAO: LocationsDAO;

  constructor() {
    this.locationsDAO = new LocationsDAO();
  }

  getCountries = async (req: Request, res: Response) => {
    try {
      const regions = await this.locationsDAO.getUniqueRegions();
      const uniqueCountries = [...new Set(regions.map(item => item.region))];
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
  };

  getCities = async (req: Request, res: Response) => {
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
      const cities = await this.locationsDAO.getCitiesByRegions(countriesList);

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
  };

  updateMapping = async (req: Request, res: Response) => {
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

      // Delete existing mappings
      await this.locationsDAO.deleteAllMappings();

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
      // Validate city IDs
      const cities = await this.locationsDAO.validateCityIds(allCityIds as string[]);

      if (!cities || cities.length !== allCityIds.length) {
        return res.status(400).json(
          errorResponse(
            'Some of the selected cities could not be found',
            400
          )
        );
      }

      // Create new mappings
      const allMappings = Object.entries(mappings).flatMap(([region, cityIds]: [string, unknown]) =>
        (cityIds as string[]).map((cityId: string) => ({
          city_id: cityId,
          region: region,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      );

      const savedMappings = await this.locationsDAO.createMappings(allMappings);

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
  }

  getMappings = async (req: Request, res: Response) => {
    try {
      const mappings = await this.locationsDAO.getAllMappings();

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
  };
} 
import { Request, Response } from 'express';
import { LocationsDAO, LocationMapping } from '../dao/locations.dao';
import { CityDAO, CityData } from '../dao/city.dao';
import { successResponse, errorResponse } from '../utils/api-response';
import viatorAPI from '../integrations/viator';
import { ninjaAPI } from '../integrations/ninja.api';
import { ViatorDestination } from '../types/viator';

export class LocationsController {
  private locationsDAO: LocationsDAO;
  private cityDAO: CityDAO;

  constructor() {
    this.locationsDAO = new LocationsDAO();
    this.cityDAO = new CityDAO();
  }

  getCountries = async (req: Request, res: Response) => {
    try {
      const countriesResponse = await viatorAPI.getCountries();
     
      const formattedCountries = countriesResponse.items.map((country: ViatorDestination) => ({
        id: country.destinationId,
        name: country.destinationName,
        region: country.destinationName, // For backward compatibility
        destinationId: country.destinationId,
        destinationName: country.destinationName,
        destinationType: country.destinationType,
        parentId: country.parentId,
        timeZone: country.timeZone,
        iataCode: country.iataCode,
        coordinates: country.coordinates,
        sortOrder: country.sortOrder
      }));

      return res.status(200).json(
        successResponse(
          {
            items: formattedCountries,
            totalCount: countriesResponse.totalCount,
            currentPage: countriesResponse.currentPage,
            totalPages: countriesResponse.totalPages,
            hasMore: countriesResponse.hasMore
          },
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
      const parentId = req.query.parentId as string;

      if (!parentId) {
        return res.status(400).json(
          errorResponse(
            'ParentId parameter is required',
            400
          )
        );
      }

      const countryIds = parentId.split(',').map(id => id.trim()).filter(Boolean);
      console.log('Fetching cities for countries:', countryIds);

      const citiesResponse = await viatorAPI.getCitiesByCountries(countryIds);
      console.log('Received cities from Viator:', citiesResponse.items.length);

      // Get existing cities data from database to include population
      const existingCities = await Promise.all(
        citiesResponse.items.map(city => 
          this.cityDAO.getCityByName(city.destinationName)
        )
      );

      // Create a map of city names to their population data
      const cityPopulationMap = new Map(
        existingCities
          .filter(city => city !== null)
          .map(city => [city.name, city.population])
      );

      const formattedCities = await Promise.all(citiesResponse.items.map(async (city: ViatorDestination) => {
        // Get population from database or fetch from Ninja API
        let population = cityPopulationMap.get(city.destinationName);
        
        if (population === undefined) {
          console.log(`Fetching population data from Ninja API for ${city.destinationName}`);
          population = await ninjaAPI.getCityPopulation(city.destinationName);
          
          if (population !== null) {
            // Save the population data to database for future use
            const cityData: CityData = {
              name: city.destinationName,
              population: population,
              destination_id: city.destinationId,
              destination_name: city.destinationName
            };
            try {
              await this.cityDAO.upsertCity(cityData);
              console.log(`Saved population data for ${city.destinationName}: ${population}`);
            } catch (error) {
              console.error(`Error saving population data for ${city.destinationName}:`, error);
            }
          }
        }

        return {
          id: city.destinationId,
          name: city.destinationName,
          region: city.countryName || city.parentId || 'Unknown',
          destinationId: city.destinationId,
          destinationName: city.destinationName,
          destinationType: city.destinationType,
          parentId: city.parentId,
          timeZone: city.timeZone,
          iataCode: city.iataCode,
          coordinates: city.coordinates,
          sortOrder: city.sortOrder,
          countryName: city.countryName || city.parentId || 'Unknown',
          lookupId: city.lookupId,
          population: population || undefined
        };
      }));

      console.log(`Returning ${formattedCities.length} cities with population data`);

      return res.status(200).json(
        successResponse(
          {
            items: formattedCities,
            totalCount: citiesResponse.totalCount,
            currentPage: citiesResponse.currentPage,
            totalPages: citiesResponse.totalPages,
            hasMore: citiesResponse.hasMore
          },
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
      console.log('Received mappings:', JSON.stringify(mappings, null, 2));

      if (!mappings || typeof mappings !== 'object') {
        return res.status(400).json(
          errorResponse(
            'Please provide valid country and city mappings',
            400
          )
        );
      }

      // Delete existing mappings
      await this.locationsDAO.deleteAllMappings();
      console.log('Deleted existing mappings');

      // Get all unique cityIds
      const allCityIds = [...new Set(
        Object.values(mappings).flat()
      )];
      console.log('Unique city IDs to process:', allCityIds);

      if (allCityIds.length === 0) {
        return res.status(200).json(
          successResponse(
            null,
            'All location mappings have been cleared successfully',
            200
          )
        );
      }

      // Fetch selected cities data from Viator
      console.log('Fetching cities data from Viator for countries:', Object.keys(mappings));
      const selectedCitiesResponse = await viatorAPI.getCitiesByCountries(Object.keys(mappings));
      console.log('Received cities from Viator:', selectedCitiesResponse.items.length);

      // Create a map of all cities from Viator response
      const selectedCitiesMap = new Map(
        selectedCitiesResponse.items.map(city => [city.destinationId, city])
      );
      console.log('Created cities map with keys:', Array.from(selectedCitiesMap.keys()));

      // Prepare selected cities for saving
      const citiesToSave: CityData[] = [];
      const skippedCities: string[] = [];
      
      // Process each selected city ID
      for (const cityId of allCityIds) {
        const city = selectedCitiesResponse.items.find(
          c => String(c.destinationId) === String(cityId)
        );

        if (city) {
          console.log(`Found matching city for ID ${cityId}: ${city.destinationName}`);
          
          try {
            // Check if city already exists
            const existingCity = await this.cityDAO.getCityByName(city.destinationName);
            
            if (existingCity) {
              console.log(`City ${city.destinationName} exists, updating destination info...`);
              try {
                await this.cityDAO.updateCity(existingCity.id, {
                  destination_id: city.destinationId,
                  destination_name: city.destinationName,
                  destination_type: city.destinationType,
                  parent_id: city.parentId || undefined
                });
                console.log(`Successfully updated destination info for city: ${city.destinationName}`);
              } catch (error) {
                console.error(`Error updating destination info for city ${city.destinationName}:`, error);
                skippedCities.push(city.destinationName);
              }
              continue;
            }

            // Fetch population data from Ninja API
            console.log(`Fetching population data for ${city.destinationName}`);
            const population = await ninjaAPI.getCityPopulation(city.destinationName);
            //console.log("population---", population);
            const cityData: CityData = {
              name: city.destinationName,
              description: '', // Can be updated later with more detailed info
              latitude: city.coordinates?.latitude,
              longitude: city.coordinates?.longitude,
              type: city.destinationType,
              region: city.countryName || city.parentId || 'Unknown',
              viator_id: city.destinationId,
              active: true,
              destination_id: city.destinationId,
              destination_name: city.destinationName,
              destination_type: city.destinationType,
              parent_id: city.parentId || undefined,
              time_zone: city.timeZone,
              iata_code: city.iataCode,
              sort_order: city.sortOrder,
              lookup_id: city.lookupId,
              population: population || undefined // Add population data if available
            };
            console.log(`Preparing data for city ${city.destinationName}:`, JSON.stringify(cityData, null, 2));
            citiesToSave.push(cityData);
          } catch (error) {
            console.error(`Error checking existing city ${city.destinationName}:`, error);
            // Continue with next city if there's an error checking this one
            continue;
          }
        } else {
          console.log(`Warning: No matching city found for ID ${cityId}`);
        }
      }

      // Save new cities to database
      if (citiesToSave.length > 0) {
        console.log(`Saving ${citiesToSave.length} new cities to database...`);
        try {
          for (const cityData of citiesToSave) {
            try {
              console.log("cityData---", cityData);
              await this.cityDAO.upsertCity(cityData);
              console.log(`Successfully saved city: ${cityData.name} with population: ${cityData.population || 'N/A'}`);
            } catch (error) {
              console.error(`Error saving city ${cityData.name}:`, error);
              skippedCities.push(cityData.name);
            }
          }
          console.log('Finished processing all cities');
        } catch (error) {
          console.error('Error during city save process:', error);
        }
      } else {
        console.log('No new cities to save in database');
      }

      if (skippedCities.length > 0) {
        console.log('Skipped existing cities:', skippedCities);
      }

      // Create new mappings
      console.log('Creating location mappings...');
      const allMappings = Object.entries(mappings).flatMap(([countryId, cityIds]: [string, unknown]) =>
        (cityIds as number[]).map((cityId: number) => ({
          country_id: parseInt(countryId),
          city_id: cityId,
          created_by: 'system',
          updated_by: 'system',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      );

      console.log('Created mappings:', JSON.stringify(allMappings, null, 2));
      const savedMappings = await this.locationsDAO.createMappings(allMappings);
      console.log('Mappings saved successfully');

      // Count countries and cities for the success message
      const countryCount = Object.keys(mappings).length;
      const cityCount = allCityIds.length;
      const newCityCount = citiesToSave.length - skippedCities.length;

      return res.status(200).json(
        successResponse(
          savedMappings,
          `Successfully updated ${cityCount} ${cityCount === 1 ? 'city' : 'cities'} in ${countryCount} ${countryCount === 1 ? 'country' : 'countries'} (${newCityCount} new cities added, ${skippedCities.length} existing cities skipped)`,
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
  };

  getMappings = async (req: Request, res: Response) => {
    try {
      const mappings = await this.locationsDAO.getAllMappings();

      // Transform the data into a more usable format
      const countryMappings: { [key: string]: string[] } = {};

      // Group cities by country
      mappings?.forEach(mapping => {
        if (!countryMappings[mapping.country_id]) {
          countryMappings[mapping.country_id] = [];
        }
        countryMappings[mapping.country_id].push(mapping.city_id);
      });

      return res.status(200).json(
        successResponse(
          { countryMappings },
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